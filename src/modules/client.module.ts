import { Module } from '@nestjs/common';
import { ClientController } from 'src/controllers/client.controller';
import { ClientService } from 'src/services/client.service';
import { ElfaApiModule } from './elfa-api.module';

@Module({
  imports: [ElfaApiModule],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
