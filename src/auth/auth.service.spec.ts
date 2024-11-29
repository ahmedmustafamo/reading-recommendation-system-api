import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';
import { User } from '../users/user.entity';
import { JwtPayload } from './types/JwtPayload';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  // Mocking the dependencies
  const mockUserService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: bcrypt.hashSync('password123', 10), // Assume password is hashed
    role: 'user',
    name: "eee",
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return a user if email and password match', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      mockUserService.findByEmail.mockResolvedValue(mockUser);

      // Act
      const result = await authService.validateUser(email, password);

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compareSync(password, mockUser.password)).toBe(true);
    });

    it('should throw BadRequestException if user is not found', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      const password = 'password123';
      mockUserService.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(authService.validateUser(email, password)).rejects.toThrow(
        new BadRequestException('User not found'),
      );
    });

    it('should throw BadRequestException if password does not match', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'wrongpassword';
      mockUserService.findByEmail.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(authService.validateUser(email, password)).rejects.toThrow(
        new BadRequestException('Email or Password does not match'),
      );
    });
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      // Arrange
      const user = mockUser;
      const payload: JwtPayload = { email: user.email, sub: user.id, role: user.role };
      const accessToken = 'jwt.token';

      mockJwtService.sign.mockReturnValue(accessToken);

      // Act
      const result = await authService.login(user);

      // Assert
      expect(result).toEqual({ access_token: accessToken });
      expect(mockJwtService.sign).toHaveBeenCalledWith(payload);
    });
  });
});
