import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // LABORATORIO 2: carga variables de entorno
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module'; // LABORATORIO 2: módulo de autenticación
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { TimingMiddleware } from './common/middlewares/timing.middleware';
import { ProductEntity } from './products/product.entity';
import { CategoryEntity } from './categories/category.entity';
import { UserEntity } from './users/user.entity'; // LABORATORIO 2: entidad de usuarios

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.local'] }), // LABORATORIO 2
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'products.db',
      entities: [ProductEntity, CategoryEntity, UserEntity], // LABORATORIO 2: agregada UserEntity
      synchronize: true,
    }),
    ProductsModule,
    UsersModule,
    CategoriesModule,
    AuthModule, // LABORATORIO 2
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware, TimingMiddleware).forRoutes('*');
  }
}