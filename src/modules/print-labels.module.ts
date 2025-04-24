import { Module } from '@nestjs/common';

import { PrinterIntegrationApiModule } from './printer-integration-api.module';
import { PrintLabelsService } from 'src/services/print-labels.service';
import { PrintLabelsController } from 'src/controllers/print-labels.controller';
import { ProductModule } from './product.module';
import { ProductHistoryService } from 'src/services/product-history.service';

@Module({
  imports: [PrinterIntegrationApiModule, ProductModule],
  controllers: [PrintLabelsController],
  exports: [PrintLabelsService],
  providers: [PrintLabelsService, ProductHistoryService],
})
export class PrintLabelsModule {}
