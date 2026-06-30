import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { Category, CreateCategoryInput } from './category.types';

export const CATEGORIES_REPOSITORY = 'CATEGORIES_REPOSITORY';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repo: Repository<CategoryEntity>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.repo.find();
  }

  findById(id: number): Promise<Category | undefined> {
    return this.repo.findOneBy({ id }).then(e => e ?? undefined);
  }

  create(input: CreateCategoryInput): Promise<Category> {
    return this.repo.save(this.repo.create(input));
  }

  async remove(id: number): Promise<Category | undefined> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: { products: true },
    });
    if (!entity) return undefined;
    await this.repo.remove(entity);
    return entity;
  }

  findWithProducts(id: number): Promise<CategoryEntity | undefined> {
    return this.repo.findOne({
      where: { id },
      relations: { products: true },
    }).then(e => e ?? undefined);
  }
  async update(id: number, input: CreateCategoryInput): Promise<Category> {
    await this.repo.update(id, input);
    return this.repo.findOneBy({ id }) as Promise<Category>;
  }

  async unlinkCategory(productId: number): Promise<void> {
    await this.repo.manager
      .createQueryBuilder()
      .update('products')
      .set({ categoryId: null })
      .where('id = :id', { id: productId })
      .execute();
  }
}
