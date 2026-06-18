import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards, // LABORATORIO 3
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'; // LABORATORIO 3
import { RolesGuard } from '../../common/guards/roles.guard'; // LABORATORIO 3
import { Roles } from '../../common/decorators/roles.decorator'; // LABORATORIO 3
import { UserRole } from '../../users/user-role.enum'; // LABORATORIO 3

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // LABORATORIO 3: ruta pública — cualquiera puede ver productos
  @Get()
  findAll(
    @Query('name') name?: string,
    @Query('orderBy') orderBy?: string,
    @Query('order') order?: string,
  ): Promise<Product[]> {
    return this.productsService.findAll(name, orderBy, order);
  }

  // LABORATORIO 3: ruta pública
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(Number(id));
  }

  // LABORATORIO 3: solo admin puede crear productos
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() body: CreateProductInput): Promise<Product> {
    return this.productsService.create(body);
  }

  // LABORATORIO 3: solo admin puede actualizar productos
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() body: UpdateProductInput): Promise<Product> {
    return this.productsService.update(Number(id), body);
  }

  // LABORATORIO 3: solo admin puede eliminar productos
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string): Promise<Product> {
    return this.productsService.remove(Number(id));
  }

  // LABORATORIO 3: solo admin puede actualizar stock
  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStock(
    @Param('id') id: string,
    @Body() body: { quantity: number },
  ): Promise<Product> {
    return this.productsService.updateStock(Number(id), body.quantity);
  }
}