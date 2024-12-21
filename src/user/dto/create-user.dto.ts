import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MinLength,
  IsEnum,
  Matches,
  MaxLength,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { listRoles } from 'src/dataGlobal';

export class CreateUserDto {
  @IsString()
  @MinLength(4, { message: 'Name is too short' })
  @MaxLength(50, { message: 'Name is too long' })
  name: string;

  @IsEmail({}, { message: 'Invalid email' })
  @Matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, {
    message: 'Invalid email according to regex',
  })
  email: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: 'password too weak' },
  )
  password: string;

  @IsArray({ message: 'Roles must be an array' })
  @ArrayNotEmpty({ message: 'Roles array should not be empty' })
  @IsEnum(listRoles, { each: true, message: 'Each role must be a valid role' })
  roles: string[] = [listRoles[1]];

  @IsEnum(['active', 'inactive'])
  status: string = 'inactive';

  imageUrl: string;
}
