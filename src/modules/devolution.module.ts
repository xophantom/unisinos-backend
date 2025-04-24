import { Module, forwardRef } from '@nestjs/common';

import { ElfaApiModule } from './elfa-api.module';
import { DevolutionService } from 'src/services/devolution.service';
import { WarehouseModule } from './warehouse.module';
import { OrderModule } from './order.module';
import { StoreModule } from './store.module';

@Module({
  imports: [ElfaApiModule, StoreModule, WarehouseModule, forwardRef(() => OrderModule)],
  providers: [DevolutionService],
  exports: [DevolutionService],
})
export class DevolutionModule {}
