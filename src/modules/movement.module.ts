import { Module } from '@nestjs/common';
import { MovementService } from 'src/services/movements.service';

@Module({
  providers: [MovementService],
  exports: [MovementService],
})
export class MovementModule {}
