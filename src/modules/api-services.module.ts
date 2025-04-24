import { Module } from '@nestjs/common';
import { StockController } from 'src/controllers/stock.controller';
import { StockService } from 'src/services/stock.service';
import { ProductModule } from './product.module';
import { ElfaApiModule } from './elfa-api.module';
import { StoreModule } from './store.module';
import { InvoiceController } from 'src/controllers/api-services.controller';

@Module({
  imports: [ProductModule, ElfaApiModule, StoreModule, ApiServicesModule],
  controllers: [StockController, InvoiceController],
  providers: [StockService],
})
export class ApiServicesModule {}
