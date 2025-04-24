import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Warehouse, ApiLog, Interaction, Course } from '../entities';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Warehouse, ApiLog, Interaction, Course])],
  exports: [TypeOrmModule.forFeature([Warehouse, ApiLog, Interaction, Course])],
})
export class RepositoryModule {}
