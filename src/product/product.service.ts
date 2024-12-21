import { Injectable, Inject } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { uploadOneFileToBucket } from 'src/lib/awsLib';

@Injectable()
export class ProductService {

  constructor(
    //eslint-disable-next-line
    @Inject('PRODUCT_MODEL')
    private productModel: Model<Product>,
  ) { }

  async create(createProductDto: CreateProductDto, file?: Express.Multer.File) {
    //return 'This action adds a new product';
    const createdProduct = new this.productModel(createProductDto);
    const newProduct:any= await createdProduct.save();
    const { _id } = newProduct;
    if (file) {
      const urlFile = await uploadOneFileToBucket(file, _id);
      newProduct.imageUrl = urlFile;
      await this.update(_id, newProduct);
    }

    return newProduct;
  }

  findAll() {
    //return `This action returns all product`;
    return this.productModel.find().exec();
  }

  findOne(id: string) {
    //return `This action returns a #${id} product`;
    return this.productModel.findById(id).exec();
  }

  findByVendor(id: string) {
    //return `This action returns all product by vendor #${id}`;
    return this.productModel.find({ vendorId: id }).exec();
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    //return `This action updates a #${id} product`;
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, {new:true}).exec();
    return updatedProduct;
  }

  remove(id: string) {
    //return `This action removes a #${id} product`;
    return this.productModel.findByIdAndDelete(id).exec();
  }
}
