import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';

export const PRODUCTS_REPOSITORY = 'PRODUCTS_REPOSITORY';

export interface ProductsRepository {
  findAll(name?: string, orderBy?: string, order?: string, page?: number, limit?: number): Promise<{ items: Product[]; total: number; page: number; limit: number }>;
  findById(id: number): Product | undefined | Promise<Product | undefined>;
  create(input: CreateProductInput): Product | Promise<Product>;
  update(id: number, input: UpdateProductInput): Product | undefined | Promise<Product | undefined>;
  remove(id: number): Product | undefined | Promise<Product | undefined>;
  updateStock(id: number, quantity: number): Product | undefined | Promise<Product | undefined>;
}