import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ListWarehouseSwagger } from '../openapi/warehouse.controller.swagger';

import { WarehouseService } from 'src/services/warehouse.service';

@ApiTags('Armazéns')
@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @ListWarehouseSwagger()
  @Get()
  async listWarehouses(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe)
    pageSize: number,
  ) {
    return this.warehouseService.listWarehouses(page, pageSize);
  }
}
