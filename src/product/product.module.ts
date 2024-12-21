import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { databaseProviders } from 'src/database/database.providers';
import { productProviders } from './product.providers';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ...databaseProviders, ...productProviders],
})
export class ProductModule {}
