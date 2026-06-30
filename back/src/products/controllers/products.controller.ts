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
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../product.types';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../users/user-role.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // agrega JWT, paginación y sortBy
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('name') name?: string,
    @Query('sortBy') orderBy?: string,
    @Query('order') order?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{ items: Product[]; total: number; page: number; limit: number }> {
    return this.productsService.findAll(
      name,
      orderBy,
      order,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }

  // agrega JWT
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() body: CreateProductInput): Promise<Product> {
    return this.productsService.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() body: UpdateProductInput): Promise<Product> {
    return this.productsService.update(Number(id), body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string): Promise<Product> {
    return this.productsService.remove(Number(id));
  }

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

