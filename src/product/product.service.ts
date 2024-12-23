import { Injectable, Inject } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { uploadOneFileToBucket } from 'src/lib/awsLib';
import { TFilter } from './product.controller';

@Injectable()
export class ProductService {
  constructor(
    //eslint-disable-next-line
    @Inject('PRODUCT_MODEL')
    private productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto, file?: Express.Multer.File) {
    //return 'This action adds a new product';
    const createdProduct = new this.productModel(createProductDto);
    const newProduct: any = await createdProduct.save();
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
    return this.productModel.find().sort({createdAt:-1}).exec();
  }

  getAllByFilter(body: TFilter) {
    const { query, price, vendorId } = body;
    let filter = {};
    if (query) {
      filter = {
        ...filter,
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { sku: { $regex: query, $options: 'i' } },
        ],
      };
    }
    if (price) {
      filter = {
        ...filter,
        price: { $lte: price },
      };
    }
    if (vendorId) {
      filter = {
        ...filter,
        vendorId,
      };
    }
    return this.productModel.find(filter).sort({createdAt:-1}).exec();
  }

  findOne(id: string) {
    //return `This action returns a #${id} product`;
    return this.productModel.findById(id).exec();
  }

  findByVendor(id: string) {
    //return `This action returns all product by vendor #${id}`;
    return this.productModel.find({ vendorId: id }).sort({createdAt:-1}).exec();
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    file?: Express.Multer.File,
  ) {
    try {
      if (file) {
        const urlFile = await uploadOneFileToBucket(file, id);
        if (typeof urlFile === 'string') updateProductDto.imageUrl = urlFile;
      }
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, updateProductDto, { new: true })
        .exec();
      return updatedProduct;
    } catch (error) {
      console.log(error);
      throw new Error('Error updating product');
    }
  }

  remove(id: string) {
    //return `This action removes a #${id} product`;
    return this.productModel.findByIdAndDelete(id).exec();
  }
}
