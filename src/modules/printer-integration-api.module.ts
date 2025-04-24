import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrinterIntegrationApiService } from 'src/services/printer-integration-api.service';

@Module({
  imports: [HttpModule],
  exports: [PrinterIntegrationApiService],
  providers: [PrinterIntegrationApiService],
})
export class PrinterIntegrationApiModule {}
