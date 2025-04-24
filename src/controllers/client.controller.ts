import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientService } from '../services';
import { ListClientsSwagger, ListClientStoresSwagger, ListElfaCustomerSwagger } from '../openapi';

@ApiTags('Clientes')
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ListClientsSwagger()
  @Get()
  async listClients(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(25), ParseIntPipe) pageSize: number,
    @Query('search') search?: string,
    @Query('searchByDocument') searchByDocument?: string,
  ) {
    return this.clientService.listClients(page, pageSize, search, searchByDocument);
  }

  @ListClientStoresSwagger()
  @Get(':clientId/stores')
  async listClientStores(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(99), ParseIntPipe)
    pageSize: number,
  ) {
    return this.clientService.listClientStores(clientId, page, pageSize);
  }

  @ListElfaCustomerSwagger()
  @Get('elfa-customer/:clientId')
  async listElfaCustomer(@Param('clientId', ParseIntPipe) clientId: string) {
    return this.clientService.getElfaCustomer(clientId);
  }

  @Get('stores')
  async listStores(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(25), ParseIntPipe) pageSize: number,
    @Query('search') search?: string,
    @Query('searchByDocument') searchByDocument?: string,
    @Query('code') code?: string,
  ) {
    return this.clientService.listStores(page, pageSize, search, searchByDocument, code);
  }
}
