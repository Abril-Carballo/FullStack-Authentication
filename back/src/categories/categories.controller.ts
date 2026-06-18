import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category, CreateCategoryInput } from './category.types';
import { Product } from '../products/product.types';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: CreateCategoryInput): Promise<Category> {
    return this.categoriesService.create(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.remove(Number(id));
  }

  @Get(':id/products')
  findProducts(@Param('id') id: string): Promise<Product[]> {
    return this.categoriesService.findProducts(Number(id));
  }
}