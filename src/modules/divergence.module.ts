import { forwardRef, Module } from '@nestjs/common';
import { ElfaApiModule } from './elfa-api.module';
import { DivergenceController } from 'src/controllers/divergence.controller';
import { DivergenceService } from 'src/services/divergence.service';
import { DevolutionModule } from './devolution.module';
import { ProductModule } from './product.module';
import { MovementModule } from './movement.module';
import { InventoryOrderModule } from './inventory-order.module';

@Module({
  imports: [forwardRef(() => DevolutionModule), ProductModule, MovementModule, InventoryOrderModule, ElfaApiModule],

  controllers: [DivergenceController],
  providers: [DivergenceService],
})
export class DivergenceModule {}
