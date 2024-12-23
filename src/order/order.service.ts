import { Injectable, Inject } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Model } from 'mongoose';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {

  constructor(
    //eslint-disable-next-line
    @Inject('ORDER_MODEL')
    private orderModel: Model<Order>,
  ) { }

  create(createOrderDto: CreateOrderDto) {
    //return 'This action adds a new order';
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  findAll() {
    //return `This action returns all order`;
    return this.orderModel.find().populate('customerId').exec();
    
  }

  findByCustomer(id: string) {
    //return `This action returns all order by customer #${id}`;
    return this.orderModel.find({ customerId: id }).populate('customerId').exec();
  }

  findOne(id: string) {
    //return `This action returns a #${id} order`;
    return this.orderModel.findById(id).exec();
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    //return `This action updates a #${id} order`;
    return this.orderModel.findByIdAndUpdate(id, updateOrderDto, {new:true}).exec();
  }

  remove(id: string) {
    //return `This action removes a #${id} order`;
    return this.orderModel.findByIdAndDelete(id).exec();
  }
}
