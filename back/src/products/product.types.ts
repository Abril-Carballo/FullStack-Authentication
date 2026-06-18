import { IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export type Product = {
  id: number;
  name: string;
  price: number;
  stock?: number;
  categoryId?: number;
};

export class CreateProductInput {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsNumber()
  @Min(0.01)
  price!: number;

  @IsNumber()
  @Min(0)
  stock!: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}

export class UpdateProductInput {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}