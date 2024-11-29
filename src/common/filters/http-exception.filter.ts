import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm'; // TypeORM-specific error class

@Catch(HttpException, QueryFailedError) // Catch both HttpExceptions and QueryFailedError (TypeORM)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest();

    // If the exception is a QueryFailedError (from TypeORM)
    if (exception instanceof QueryFailedError) {
      // Check if it's a unique constraint violation
      if (exception.driverError.code === '23505') { // PostgreSQL unique constraint violation code
        // Format the response for unique constraint violation
        const message = `Duplicate entry: ${exception.driverError.detail || 'Unknown detail'}`;
        this.logger.error(`Database Error: ${message}, Request URL: ${request.url}`);
        
        return response.status(400).json({
          statusCode: 400,
          message: message,
          path: request.url,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // If it's a general HttpException (e.g., validation errors, other exceptions)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();
      let message = 'Internal server error';

      if (typeof errorResponse === 'string') {
        message = errorResponse;
      } else if (typeof errorResponse === 'object') {
        message = (errorResponse as any).message || message;
      }

      this.logger.error(`HTTP Status: ${status}, Error Message: ${message}, Request URL: ${request.url}`);
      return response.status(status).json({
        statusCode: status,
        message,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }

    // Fallback: if the exception isn't caught by the above conditions, return a generic 500 error
    this.logger.error(`Unexpected Error: ${exception.message}`);
    return response.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
