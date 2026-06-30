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

  async create(input: CreateCategoryInput): Promise<Category> {
    try {
      return await this.categoriesRepository.create(input);
    } catch (err: any) {
      if (err.code === '23505') throw new ConflictException('Category name already exists');
      throw err;
    }
  }

  async update(id: number, input: CreateCategoryInput): Promise<Category> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    try {
      return await this.categoriesRepository.update(id, input);
    } catch (err: any) {
      if (err.code === '23505') throw new ConflictException('Category name already exists');
      throw err;
    }
  }

  async remove(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findWithProducts(id);
    if (!category) throw new NotFoundException('Category not found');

    // si tiene productos, desvinculamos la categoría antes de borrarla
    if (category.products?.length > 0) {
      await Promise.all(
        category.products.map(p =>
          this.categoriesRepository.unlinkCategory(p.id)
        )
      );
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