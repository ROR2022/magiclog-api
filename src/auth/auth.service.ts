import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { uploadOneFileToBucket } from 'src/lib/awsLib';


@Injectable()
export class AuthService {
  constructor(
    //eslint-disable-next-line prettier/prettier
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {
    this.jwtService = new JwtService({
      secret: this.configService.get('JWT_SECRET'),
      signOptions: { expiresIn: this.configService.get('JWT_EXPIRES_IN') },
    });
  }

  async login(dataLoginUser: SignInDto) {
    const { email, password: pass } = dataLoginUser;
    const user: any = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('User not active');
    }
    const { password: passUser } = user;
    const isMatchPassword = await bcrypt.compare(pass, passUser);
    if (!isMatchPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = {
      email: user.email,
      username: user.name,
      roles: user.roles,
      id: user._id,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...dataUser } = user;
    
    const token = await this.jwtService.signAsync(payload);
    return {
      dataUser:{...dataUser._doc, access_token: token},
    };
  }

  async register(user: CreateUserDto, file?: Express.Multer.File) {
    
    try {
      user.imageUrl = '';
      user.password = await bcrypt.hash(user.password, 10);
  
      const newUser: any = await this.userService.create(user);
      const { _id } = newUser;

      if (file) {
        const urlFile = await uploadOneFileToBucket(file, _id);
        newUser.imageUrl = urlFile;
        await this.userService.update(_id, newUser);
      }
      const payload = {
        email: newUser.email,
        username: newUser.name,
        roles: newUser.roles,
        id: newUser._id,
      };
      const token = await this.jwtService.signAsync(payload);

       
      return {...newUser._doc, access_token: token};  
    } catch (error) {
      console.log('Error Creating User :', error);
      throw new UnauthorizedException('Error creating user');
    }
    
  }

  
}
