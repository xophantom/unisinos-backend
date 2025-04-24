import { Module, forwardRef } from '@nestjs/common';
import { WarehouseController } from '../controllers/warehouse.controller';
import { ElfaApiModule } from './elfa-api.module';
import { DevolutionModule } from './devolution.module';
import { OrderModule } from './order.module';
import { WarehouseService } from 'src/services/warehouse.service';
import { StoreModule } from './store.module';

@Module({
  imports: [
    ElfaApiModule,
    forwardRef(() => OrderModule),
    forwardRef(() => DevolutionModule),
    forwardRef(() => StoreModule),
  ],
  controllers: [WarehouseController],
  providers: [WarehouseService],
  exports: [WarehouseService],
})
export class WarehouseModule {}
