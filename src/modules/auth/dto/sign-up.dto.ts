import { IsEmail, IsNotEmpty, IsStrongPassword, MaxLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  @IsNotEmpty()
  @MaxLength(50)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
