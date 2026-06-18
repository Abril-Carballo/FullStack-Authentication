import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../product.entity';
import { ProductsRepository } from './products.repository';
import { CreateProductInput, Product, UpdateProductInput } from '../product.types';

@Injectable()
export class TypeOrmProductsRepository implements ProductsRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
  ) {}

  findAll(name?: string, orderBy?: string, order?: string): Promise<Product[]> {
    let query = this.repo.createQueryBuilder('p');

    if (name) {
      query = query.where('LOWER(p.name) LIKE :name', { name: `%${name.toLowerCase()}%` });
    }

    if (orderBy === 'price' || orderBy === 'name') {
      query = query.orderBy(`p.${orderBy}`, order === 'desc' ? 'DESC' : 'ASC');
    }

    return query.getMany();
  }

  findById(id: number): Promise<Product | undefined> {
    return this.repo.findOneBy({ id }).then(e => e ?? undefined);
  }

  create(input: CreateProductInput): Promise<Product> {
    return this.repo.save(this.repo.create(input));
  }

  update(id: number, input: UpdateProductInput): Promise<Product | undefined> {
    return this.repo.findOneBy({ id }).then(async entity => {
      if (!entity) return undefined;
      Object.assign(entity, input);
      return this.repo.save(entity);
    });
  }

  remove(id: number): Promise<Product | undefined> {
    return this.repo.findOneBy({ id }).then(async entity => {
      if (!entity) return undefined;
      await this.repo.remove(entity);
      return entity;
    });
  }

  updateStock(id: number, quantity: number): Promise<Product | undefined> {
    return this.repo.findOneBy({ id }).then(async entity => {
      if (!entity) return undefined;
      entity.stock = (entity.stock ?? 0) - quantity;
      return this.repo.save(entity);
    });
  }
}
