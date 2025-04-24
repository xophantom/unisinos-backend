import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetOrderShippingStatusSwagger, ListOrderDetailsSwagger } from '../openapi';
import { Order } from '../entities';
import { OrderService } from 'src/services/order.service';
import { InventoryOrderService } from 'src/services/inventory-order.service';
import {
  AddProductInventoryOrderDTO,
  AddProductInventoryOrderResponse,
  CreateInventoryOrderDTO,
  CreateReversalOrderDTO,
} from 'src/domain/dtos';
import { ElfaApiService } from 'src/services';
import {
  ElfaApiOrderByProductResponseModel,
  ElfaApiOrderByProductViewResponseModel,
} from 'src/domain/models/elfa-api-orders-by-product-response.model';
import { ReverseProductDTO } from 'src/domain/dtos/reverse-product.dto';
import { User } from 'src/decorators/user.decorator';
import { UserDetails } from 'src/domain/interfaces/user-cognito';

@ApiTags('Pedidos')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly inventoryOrderService: InventoryOrderService,
    private readonly elfaApiService: ElfaApiService,
  ) {}

  @ListOrderDetailsSwagger()
  @Get(':orderId/details')
  async getOrderDetails(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.getOrderDetails(orderId);
  }

  @GetOrderShippingStatusSwagger()
  @Get(':orderId/shipping-status')
  async getOrderShippingStatus(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.getOrderShippingStatus(orderId);
  }

  @Post('inventory')
  async createInventoryOrder(@Body() params: CreateInventoryOrderDTO): Promise<Order> {
    return await this.inventoryOrderService.createInventoryOrder(params);
  }

  @Post('inventory-reversal')
  async createReversalOrder(@Body() params: CreateReversalOrderDTO): Promise<Order> {
    return await this.inventoryOrderService.createReversalOrder(params);
  }

  @Post('inventory/products')
  async addProductInventoryOrder(
    @Body() params: AddProductInventoryOrderDTO,
    @User() user: UserDetails,
  ): Promise<AddProductInventoryOrderResponse> {
    const username = user.email || user.username;
    return await this.inventoryOrderService.addProductInventoryOrder(params, username);
  }

  @Post('inventory/products-without-print')
  async addProductInventoryOrderWithoutPrint(
    @Body() params: AddProductInventoryOrderDTO,
  ): Promise<AddProductInventoryOrderResponse> {
    return await this.inventoryOrderService.addProductInventoryOrderWithoutPrint(params);
  }

  @HttpCode(200)
  @Post('by-product-details')
  async getOrdersByProductDetails(
    @Body('CustomerCGC') CustomerCGC: string,
    @Body('ProductCode') ProductCode: number,
    @Body('BatchCode') BatchCode: string,
  ): Promise<ElfaApiOrderByProductResponseModel[]> {
    return this.elfaApiService.getOrdersByProductDetails(CustomerCGC, ProductCode, BatchCode);
  }

  @HttpCode(200)
  @Post('inventory/reverse-product')
  async reverseProduct(@Body() params: ReverseProductDTO): Promise<void> {
    return await this.inventoryOrderService.reverseProduct(params);
  }

  @HttpCode(200)
  @Post('by-product-details-view')
  async getOrdersByProductDetailsView(
    @Body('CustomerCGC') CustomerCGC: string,
    @Body('ProductCode') ProductCode: number,
    @Body('BatchCode') BatchCode: string,
  ): Promise<ElfaApiOrderByProductViewResponseModel[]> {
    return this.inventoryOrderService.getOrdersByProductDetailsFromView(CustomerCGC, ProductCode, BatchCode);
  }
}
