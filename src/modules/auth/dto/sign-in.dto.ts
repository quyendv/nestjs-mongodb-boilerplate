import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  // @IsStrongPassword() // signIn không nên check ở sign-in, chỉ check logic valid không thôi
  password: string;
}
