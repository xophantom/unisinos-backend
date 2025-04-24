import { Module } from '@nestjs/common';
import { StoreService } from 'src/services/store.service';
import { StoreController } from 'src/controllers/store.controller';
import { ProductModule } from './product.module';

@Module({
  imports: [ProductModule],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
