import { CreateProductDto as Product } from 'src/product/dto/create-product.dto';

export class CreateOrderDto {
  customerId: string;
  products: Array<Product>;
  total: number;
}
