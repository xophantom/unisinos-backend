import { Module } from '@nestjs/common';
import { TagController } from 'src/controllers/tag.controller';
import { TagService } from 'src/services/tag.service';

@Module({
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
