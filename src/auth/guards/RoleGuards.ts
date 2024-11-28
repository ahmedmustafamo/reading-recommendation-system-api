import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types/JwtPayload';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;  // If no roles are required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      throw new ForbiddenException('Authorization token not found');
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      throw new ForbiddenException('Token is missing');
    }

    try {
      const payload: JwtPayload = this.jwtService.verify(token, {secret: this.configService.getOrThrow('JWT_SECRET')});

      const userRole = payload.role;
      return requiredRoles.includes(userRole);
    } catch (error) {
      console.log(error)
      throw new ForbiddenException('Invalid or expired token');
    }
  }
}
