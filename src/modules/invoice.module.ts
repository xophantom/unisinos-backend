import { Module } from '@nestjs/common';
import { InvoiceController } from 'src/controllers/invoice.controller';
import { InvoiceService } from 'src/services/invoice.service';
import { ElfaApiModule } from './elfa-api.module';

@Module({
  imports: [ElfaApiModule],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
