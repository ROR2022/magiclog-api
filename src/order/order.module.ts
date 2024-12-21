import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { orderProviders } from './order.providers';
import { databaseProviders } from 'src/database/database.providers';

@Module({
  controllers: [OrderController],
  providers: [OrderService, ...orderProviders, ...databaseProviders],
})
export class OrderModule {}
