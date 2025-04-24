import { Module } from '@nestjs/common';
import { ElfaApiModule } from './elfa-api.module';
import { ProductMetricsService } from '../services/product-metrics.service';
import { ProductMetricsController } from '../controllers/product-metrics.controller';

@Module({
  imports: [ElfaApiModule],
  controllers: [ProductMetricsController],
  providers: [ProductMetricsService],
  exports: [ProductMetricsService],
})
export class ProductMetricsModule {}
