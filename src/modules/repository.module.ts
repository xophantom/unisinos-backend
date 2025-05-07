import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Interaction, Course } from '../entities';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Interaction, Course])],
  exports: [TypeOrmModule.forFeature([Interaction, Course])],
})
export class RepositoryModule {}
