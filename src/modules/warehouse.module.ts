import { Module } from '@nestjs/common';
import { WarehouseController } from '../controllers/warehouse.controller';

import { WarehouseService } from 'src/services/warehouse.service';

@Module({
  imports: [],
  controllers: [WarehouseController],
  providers: [WarehouseService],
  exports: [WarehouseService],
})
export class WarehouseModule {}
