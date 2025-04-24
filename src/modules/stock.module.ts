import { Module } from '@nestjs/common';
import { StockController } from 'src/controllers/stock.controller';
import { StockService } from 'src/services/stock.service';
import { ProductModule } from './product.module';
import { ElfaApiModule } from './elfa-api.module';
import { StoreModule } from './store.module';

@Module({
  imports: [ProductModule, ElfaApiModule, StoreModule],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
