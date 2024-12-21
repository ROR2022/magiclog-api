import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    console.log('Validation pipe value: ', value);
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      //console.log('Validation pipe errors: ', errors);
      let message = '';
      errors.forEach((err) => {
        Object.values(err.constraints).forEach((constraint) => {
          message += ` ${constraint}, `;
        });
      });
      throw new BadRequestException(message || 'Validation failed');
    }
    return value;
  }

  toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
