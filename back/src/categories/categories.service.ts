import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { Category, CreateCategoryInput } from './category.types';
import { Product } from '../products/product.types';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.findAll();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  create(input: CreateCategoryInput): Promise<Category> {
    return this.categoriesRepository.create(input);
  }

  async remove(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findWithProducts(id);
    if (!category) throw new NotFoundException('Category not found');

    if (category.products?.length > 0) {
      throw new ConflictException('No se puede eliminar una categoría con productos asociados');
    }

    const removed = await this.categoriesRepository.remove(id);
    return removed!;
  }

  async findProducts(id: number): Promise<Product[]> {
    const category = await this.categoriesRepository.findWithProducts(id);
    if (!category) throw new NotFoundException('Category not found');
    return category.products ?? [];
  }
}