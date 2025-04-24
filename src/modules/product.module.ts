import { Module } from '@nestjs/common';
import { ProductController } from 'src/controllers/product.controller';
import { ProductService } from 'src/services/product.service';
import { ElfaApiModule } from './elfa-api.module';

@Module({
  imports: [ElfaApiModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
