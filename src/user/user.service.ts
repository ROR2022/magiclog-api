import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {


  constructor(
    //eslint-disable-next-line
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) { }

  create(createUserDto: CreateUserDto) {
    //return 'This action adds a new user';
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  findAll() {
    //return `This action returns all user`;
    return this.userModel.find().exec();
  }

  findOne(id: string) {
    //return `This action returns a #${id} user`;
    return this.userModel.findById(id).exec();
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({email}).exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    //return `This action updates a #${id} user`;
    return this.userModel.findByIdAndUpdate(id, updateUserDto, {new:true}).exec();
  }

  remove(id: string) {
    //return `This action removes a #${id} user`;
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
