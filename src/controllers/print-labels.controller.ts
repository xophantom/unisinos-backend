import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrintLabelsService } from '../services';
import { PrintProductLabelDto, ReprintProductLabelDto } from '../domain';
import { PrintProductLabelSwagger } from '../openapi';
import { User } from 'src/decorators/user.decorator';
import { UserDetails } from 'src/domain/interfaces/user-cognito';

@ApiTags('Impressão de Etiquetas')
@Controller('print-labels')
export class PrintLabelsController {
  constructor(private readonly printLabelsService: PrintLabelsService) {}

  @PrintProductLabelSwagger()
  @Post('product')
  printProductLabel(@Body() body: PrintProductLabelDto, @User() user: UserDetails) {
    const username = user.email || user.username;
    return this.printLabelsService.printProductLabel(body, username);
  }

  @Post('product/reprint-fixed')
  reprintProductLabelWithFixed(@Body() body: ReprintProductLabelDto) {
    return this.printLabelsService.reprintProductLabel(body);
  }

  @Post('product/reprint-portable')
  reprintProductLabelWithPortable(@Body() body: ReprintProductLabelDto) {
    return this.printLabelsService.reprintInventoryProductLabels(body);
  }

  /* ----------------------------------- ADMIN ----------------------------------- */
  @PrintProductLabelSwagger()
  @Post('product-without-print')
  generateProductLabels(@Body() body: PrintProductLabelDto) {
    return this.printLabelsService.generateProductLabels(body);
  }
}
