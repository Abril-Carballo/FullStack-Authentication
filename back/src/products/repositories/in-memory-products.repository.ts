import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import { ProductsRepository } from './products.repository';

export class InMemoryProductsRepository implements ProductsRepository {
  private products: Product[] = [];
  private nextId = 1;

  // DESPUÉS
  // DESPUÉS
findAll(name?: string, orderBy?: string, order?: string): Product[] {
  let result = this.products;

  if (name) {
    result = result.filter((p) =>
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (orderBy === 'price' || orderBy === 'name') {
    result = [...result].sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === 'desc' ? 1 : -1;
      if (a[orderBy] > b[orderBy]) return order === 'desc' ? -1 : 1;
      return 0;
    });
  }

  return result;
}

  findById(id: number): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  create(input: CreateProductInput): Product {
    const product: Product = {
      id: this.nextId++,
      name: input.name,
      price: input.price,
      stock: input.stock ?? 0, //Agregado para el ejercicio dos, asigna 0 si no se proporciona stock.
    };

    this.products.push(product);
    return product;
  }

  update(id: number, input: UpdateProductInput): Product | undefined {
    const product = this.findById(id);
    if (!product) return undefined;

    if (input.name !== undefined) product.name = input.name;
    if (input.price !== undefined) product.price = input.price;
    if (input.stock !== undefined) product.stock = input.stock;  // Agregado para el ejercicio dos
    return product;
  }

  remove(id: number): Product | undefined {
    const product = this.findById(id);
    if (!product) return undefined;

    this.products = this.products.filter((p) => p.id !== id);
    return product;
  }

  //nuevo metodo para el ejercicio TRES, que actualiza el stock de un producto restando la cantidad vendida.
  updateStock(id: number, quantity: number): Product | undefined {
  const product = this.findById(id);
  if (!product) return undefined;

  product.stock = (product.stock ?? 0) - quantity;
  return product;
}
}

