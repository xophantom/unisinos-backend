import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ElfaApiService } from 'src/services/elfa-api.service';
import { LoggingService } from 'src/services/logging.service';

@Module({
  imports: [HttpModule],
  exports: [ElfaApiService],
  providers: [ElfaApiService, LoggingService],
})
export class ElfaApiModule {}
