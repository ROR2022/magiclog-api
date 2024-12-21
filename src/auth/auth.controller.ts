import { Body, Controller, HttpCode, HttpException, HttpStatus, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidationPipe } from 'src/filters/validation.pipe';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

export interface SignInDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  //eslint-disable-next-line
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body(new ValidationPipe()) signInDto: SignInDto) {
    //console.log('Inicia el login de: ', signInDto);
    return this.authService.login(signInDto);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('register')
  signUp(
    @Body(new ValidationPipe()) signUpDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /\/(jpg|jpeg|png)$/,
        })
        .build({
          exceptionFactory: (errors) =>
            new HttpException(errors, HttpStatus.BAD_REQUEST),
          fileIsRequired: false, // this means that the file is optional
        }),
    )
    file?: Express.Multer.File,
  ) {
    //console.log('Inicia el registro de: ', signUpDto)
    return this.authService.register(signUpDto, file);
  }

  
}
