import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import {
  PRODUCTS_REPOSITORY,
  ProductsRepository,
} from '../repositories/products.repository';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
  ) {}

  // agrega page y limit para paginación
  async findAll(name?: string, orderBy?: string, order?: string, page = 1, limit = 10): Promise<{ items: Product[]; total: number; page: number; limit: number }> {
    return this.productsRepository.findAll(name, orderBy, order, page, limit);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(input: CreateProductInput): Promise<Product> {
    return this.productsRepository.create(input);
  }

  async update(id: number, input: UpdateProductInput): Promise<Product> {
    const product = await this.productsRepository.update(id, input);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async remove(id: number): Promise<Product> {
    const product = await this.productsRepository.remove(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');

    if (quantity > (product.stock ?? 0)) {
      throw new BadRequestException('Stock insuficiente');
    }

    return this.productsRepository.updateStock(id, quantity) as Promise<Product>;
  }
}

