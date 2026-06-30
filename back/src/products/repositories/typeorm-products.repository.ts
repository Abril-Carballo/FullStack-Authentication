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

  async findAll(name?: string, orderBy?: string, order?: string, page = 1, limit = 10): Promise<{ items: Product[]; total: number; page: number; limit: number }> {
    let query = this.repo.createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'category');

    if (name) {
      query = query.where('LOWER(p.name) LIKE :name', { name: `%${name.toLowerCase()}%` });
    }

    if (orderBy === 'price' || orderBy === 'name' || orderBy === 'stock' || orderBy === 'id') {
      query = query.orderBy(`p.${orderBy}`, order === 'DESC' ? 'DESC' : 'ASC');
    }

    const total = await query.getCount();
    const items = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { items, total, page, limit };
  }

  findById(id: number): Promise<Product | undefined> {
    return this.repo.findOne({
      where: { id },
      relations: { category: true },
    }).then(e => e ?? undefined);
  }

  async create(input: CreateProductInput): Promise<Product> {
    const entity = this.repo.create(input);
    const saved = await this.repo.save(entity);
    return this.repo.findOne({
      where: { id: saved.id },
      relations: { category: true },
    }) as Promise<Product>;
  }

  update(id: number, input: UpdateProductInput): Promise<Product | undefined> {
    return this.repo.findOne({ where: { id }, relations: { category: true } }).then(async entity => {
      if (!entity) return undefined;
      Object.assign(entity, input);
      await this.repo.save(entity);
      return this.repo.findOne({ where: { id }, relations: { category: true } }) as Promise<Product>;
    });
  }

  remove(id: number): Promise<Product | undefined> {
    return this.repo.findOne({ where: { id }, relations: { category: true } }).then(async entity => {
      if (!entity) return undefined;
      await this.repo.remove(entity);
      return { ...entity, id };
    });
  }

  updateStock(id: number, quantity: number): Promise<Product | undefined> {
    return this.repo.findOne({ where: { id }, relations: { category: true } }).then(async entity => {
      if (!entity) return undefined;
      entity.stock = (entity.stock ?? 0) - quantity;
      return this.repo.save(entity);
    });
  }
}


