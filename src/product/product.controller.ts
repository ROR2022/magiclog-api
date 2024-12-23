import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpException, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  //eslint-disable-next-line
  constructor(private readonly productService: ProductService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
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
    return this.productService.create(createProductDto, file);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Get('vendor/:id')
  findByVendor(@Param('id') id: string) {
    return this.productService.findByVendor(id);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto,
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
    return this.productService.update(id, updateProductDto , file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
