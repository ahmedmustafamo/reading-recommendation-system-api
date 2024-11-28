import { IsString, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../user.enums';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  name: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => ("" + value).toUpperCase())
  @IsEnum(UserRole, { message: "role must be one of the following values: 'admin' or 'user'" })
  role: string;
}
