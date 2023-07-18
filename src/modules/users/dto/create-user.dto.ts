import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { LANGUAGES } from '../entities/user.entity';
import { CreateAddressDto } from './create-address.dto';

export class CreateUserDto {
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
  @MaxLength(50)
  username: string;

  @IsOptional()
  // @IsPhoneNumber() // NOTE
  phoneNumber?: string;

  @IsNotEmpty()
  @IsStrongPassword() // NOTE
  password: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true }) // NOTE if object: no option, elif array: add { each: true }. Always attach Type(() => type)
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(LANGUAGES, { each: true }) // NOTE: each element in array belong to 'LANGUAGES' enum
  interestedLanguages?: LANGUAGES[];
}
