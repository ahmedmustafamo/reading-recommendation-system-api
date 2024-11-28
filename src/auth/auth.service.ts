import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../users/user.service';
import { User } from '../users/user.entity';
import { JwtPayload } from './types/JwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Validate the user based on username and password
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Email or Password does not match');
    }

    return user;
  }

  // Generate a JWT token for the user
  async login(user: User) {
    const payload: JwtPayload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Register a new user (using bcrypt to hash passwords)
  async register(email: string, password: string, name: string, role: string): Promise<User> {
    const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password
    return this.userService.createUser({ email, name, role, password: hashedPassword });
  }
}
