import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { CategoryEntity } from '../categories/category.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'float' })
  price!: number;

  @Column({ default: 0 })
  stock!: number;

  @Column({ nullable: true })
  categoryId!: number;

  @ManyToOne(() => CategoryEntity, (category) => category.products, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category!: CategoryEntity;
}