import { Body, Controller, HttpCode, Param, ParseArrayPipe, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TagEventBodyDto } from '../domain';
import { TagService } from 'src/services/tag.service';
import { CheckTagsSwagger } from '../openapi';

@ApiTags('Tag')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @CheckTagsSwagger()
  @HttpCode(204)
  @Post(':antennaId/check')
  async checkTags(
    @Param('antennaId', ParseIntPipe) antennaId: number,
    @Body(new ParseArrayPipe({ items: TagEventBodyDto }))
    body: TagEventBodyDto[],
  ) {
    return this.tagService.checkTags(antennaId, body);
  }
}
