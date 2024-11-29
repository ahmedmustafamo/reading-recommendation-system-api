import { Injectable, BadRequestException, OnModuleInit, Logger } from '@nestjs/common';
import { validate } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) { }

  private readonly logger = new Logger(UserService.name);

  async onModuleInit() {
    await this.seedAdminUser();
  }

  // Check if the user exists, if not, create it
  async seedAdminUser() {
    const adminEmail = this.configService.getOrThrow('SUPER_ADMIN_EMAIL');
    const adminPassword = this.configService.getOrThrow('SUPER_ADMIN_PASSWORD');
    const existingUser = await this.userRepository.findOne({ where: { email: adminEmail } });

    if (!existingUser) {
      const hashedPassword = bcrypt.hashSync(adminPassword, 10);

      const adminUser: CreateUserDto = {
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        name: "Admin USer"
      }
      await this.createUser(adminUser);
      this.logger.log('Admin user created');
    } else {
      this.logger.log('Admin user already exists');
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const errors = await validate(createUserDto);
    if (errors.length > 0)
      throw new BadRequestException({ 'message': 'Validation failed', 'error': errors });

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  // Find a user by their username
  async findByUsername(name: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { name } });
  }

  // Find a user by their ID
  async findById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
}
