import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`${req.method} ${req.originalUrl}`);
    res.on('finish', () => {
      this.logger.log(`Response status: ${res.statusCode}`);
    });
    next();
  }
}
