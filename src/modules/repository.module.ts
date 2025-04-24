import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiLog, Interaction, Course } from '../entities';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ApiLog, Interaction, Course])],
  exports: [TypeOrmModule.forFeature([ApiLog, Interaction, Course])],
})
export class RepositoryModule {}
