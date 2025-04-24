import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, retry } from 'rxjs';
import { AxiosResponse } from 'axios';
import {
  IElfaApiPriceItem,
  IElfaApiPriceItemsResponse,
} from 'src/domain/interfaces/elfa-api-price-items-response.interface';
import { ENV } from '../config/env';
import {
  ElfaApiOrderResponseModel,
  ElfaApiOrdersByProductRequestModel,
  ElfaApiOrdersRequestModel,
  ElfaApiStockResponseModel,
  ElfaApiStocksRequestModel,
  ElfmedApiDevolutionByBranchCGCRequestModel,
  ElfmedApiDevolutionRequestModel,
  ElfmedApiDevolutionRequestModelWithoutDocument,
  ElfmedApiDevolutionRequestModelWithoutZeroLeft,
  IElfaApiDevolutionResponse,
  IElfaApiOrdersResponse,
  IElfaApiStocksResponse,
} from '../domain';
import { HttpClientService } from './http-client.service';
import { formatZeroLeft, getUniqueItemsByField, validateCNPJ } from '../tools';
import { ElfaApiError, ElfaApiNotFoundCodeError, ElfaApiNotFoundError } from 'src/errors';
import { Store } from '@/entities/store.entity';
import { InvoicedProductsRequestDTO, InvoicedProductsResponseDTO } from 'src/domain/dtos/pre-invoiced-products.dto';
import {
  IElfaApiServiceCustomerItem,
  IElfaApiServicesCustomersResponse,
} from 'src/domain/interfaces/elfa-api-services-customers-response.interface';
import { LoggingService } from './logging.service';
import { ElfaApiOrderByProductResponseModel } from 'src/domain/models/elfa-api-orders-by-product-response.model';
import { ElfaApiOrderResponseAdminModel } from 'src/domain/models/elfa-api-orders-admin-response.model';

@Injectable()
export class ElfaApiService {
  private httpClient: HttpClientService;

  constructor(
    private readonly httpService: HttpService,
    private readonly loggingService: LoggingService,
  ) {
    this.httpClient = new HttpClientService(this.httpService);
  }

  async getStocks(data: ElfaApiStocksRequestModel): Promise<ElfaApiStockResponseModel[]> {
    const { ELFA_API_URL, ELFA_API_USERNAME, ELFA_API_PASSWORD } = ENV;

    const response = await this.httpClient
      .request<IElfaApiStocksResponse>({
        baseURL: ELFA_API_URL,
        url: 'P-WMS-ConsultaEstoque',
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        auth: { username: ELFA_API_USERNAME, password: ELFA_API_PASSWORD },
        data,
      })
      .catch(() => {
        throw new ElfaApiError();
      });

    await this.loggingService.logApiCall(
      'P-WMS-ConsultaEstoque',
      { data, method: 'POST', url: 'P-WMS-ConsultaEstoque' },
      response,
    );

    if (response.data?.estoque?.length > 0) {
      const uniqueStocks = getUniqueItemsByField(response.data.estoque, 'lote');
      return uniqueStocks.map((item) => new ElfaApiStockResponseModel(item));
    }
    return [];
  }

  async getOrders(data: ElfaApiOrdersRequestModel): Promise<ElfaApiOrderResponseModel[]> {
    const { ELFA_API_URL, ELFA_API_USERNAME, ELFA_API_PASSWORD } = ENV;
    console.log('getOrders Request Data:', data);

    const response = await this.httpClient
      .request<IElfaApiOrdersResponse>({
        baseURL: ELFA_API_URL,
        url: 'P-Elfa-Services-Orders',
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        auth: { username: ELFA_API_USERNAME, password: ELFA_API_PASSWORD },
        data,
        validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
      })
      .catch(() => {
        throw new ElfaApiError();
      });

    await this.loggingService.logApiCall('P-Elfa-Services-Orders', data, response);

    if (response.data?.Items?.length > 0) {
      return response.data.Items.map((item) => new ElfaApiOrderResponseModel(item));
    }
    return [];
  }

  async getOrdersAdmin(data: ElfaApiOrdersRequestModel): Promise<ElfaApiOrderResponseAdminModel[]> {
    const { ELFA_API_URL, ELFA_API_USERNAME, ELFA_API_PASSWORD } = ENV;
    console.log('getOrders Request Data:', data);

    const response = await this.httpClient
      .request<IElfaApiOrdersResponse>({
        baseURL: ELFA_API_URL,
        url: 'P-Elfa-Services-Orders',
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        auth: { username: ELFA_API_USERNAME, password: ELFA_API_PASSWORD },
        data,
        validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
      })
      .catch(() => {
        throw new ElfaApiError();
      });

    await this.loggingService.logApiCall('P-Elfa-Services-Orders', data, response);

    if (response.data?.Items?.length > 0) {
      return response.data.Items.map((item) => new ElfaApiOrderResponseAdminModel(item));
    }
    return [];
  }

  async getOrdersByProductDetails(
    CustomerCGC: string,
    ProductCode: number,
    BatchCode: string,
  ): Promise<ElfaApiOrderByProductResponseModel[]> {
    const requestModel = new ElfaApiOrdersByProductRequestModel(CustomerCGC);
    requestModel.CustomerCGC = CustomerCGC;

    const { ELFA_API_URL, ELFA_API_USERNAME, ELFA_API_PASSWORD } = ENV;

    const response = await firstValueFrom(
      this.httpService
        .request<IElfaApiOrdersResponse>({
          baseURL: ELFA_API_URL,
          url: 'P-Elfa-Services-Orders',
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          auth: { username: ELFA_API_USERNAME, password: ELFA_API_PASSWORD },
          data: requestModel,
          validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
        })
        .pipe(),
    ).catch(() => {
      throw new ElfaApiError();
    });

    await this.loggingService.logApiCall('P-Elfa-Services-Orders', requestModel, response);

    const orders =
      response.data?.Items?.length > 0
        ? response.data.Items.map((item) => new ElfaApiOrderByProductResponseModel(item))
        : [];

    orders.forEach((order, index) => {
      console.log(`Order ${index + 1}:`, order);
      order.products.forEach((product, productIndex) => {
        console.log(`Product ${productIndex + 1}:`, product);
      });
    });

    const filteredOrders = orders.filter((order) =>
      order.products.some((product) => {
        return product.code === Number(ProductCode) && product.lot === BatchCode.toString();
      }),
    );

    return filteredOrders;
  }

  async getDevolution(data: ElfmedApiDevolutionRequestModel): Promise<ElfaApiOrderResponseModel[]> {
    const { ELFAMED_API_URL, ELFAMED_API_AUTHORIZATION } = ENV;

    console.log('getDevolution Request Data:', data);

    const response = await this.httpClient
      .request<IElfaApiDevolutionResponse>({
        baseURL: ELFAMED_API_URL,
        url: 'Returns',
        method: 'POST',
        headers: { 'content-type': 'application/json', Authorization: `Bearer ${ELFAMED_API_AUTHORIZATION}` },
        data,
      })
      .catch((error) => {
        console.error(error);
        if (error.status === 404) {
          throw new ElfaApiNotFoundCodeError();
        }
        throw new ElfaApiError();
      });

    await this.loggingService.logApiCall('Returns', data, response);

    if (response.data?.Items?.length > 0) {
      return response.data.Items.map((item) => new ElfaApiOrderResponseModel(item));
    }
    return [];
  }

  async getDevolutionByBranchCGC(
    data: ElfmedApiDevolutionByBranchCGCRequestModel,
  ): Promise<ElfaApiOrderResponseModel[]> {
    const { ELFAMED_API_URL, ELFAMED_API_AUTHORIZATION } = ENV;

    const response = await this.httpClient
      .request<IElfaApiDevolutionResponse>({
        baseURL: ELFAMED_API_URL,
        url: 'Returns',
        method: 'POST',
        headers: { 'content-type': 'application/json', Authorization: `Bearer ${ELFAMED_API_AUTHORIZATION}` },
        data,
      })
      .catch((error) => {
        console.error(error);
        if (error.status === 404) {
          throw new ElfaApiNotFoundCodeError();
        }
        throw new ElfaApiError();
      });

    await this.loggingService.logApiCall('Returns', data, response);

    if (response.data?.Items?.length > 0) {
      return response.data.Items.map((item) => new ElfaApiOrderResponseModel(item));
    }
    return [];
  }

  async getDevolutionWithoutZeroLeft(
    data: ElfmedApiDevolutionRequestModelWithoutZeroLeft,
  ): Promise<ElfaApiOrderResponseModel[]> {
    const { ELFAMED_API_URL, ELFAMED_API_AUTHORIZATION } = ENV;
    console.log('getDevolutionWithoutZeroLeft Request Data:', data);

    const response = await this.httpClient
      .request<IElfaApiDevolutionResponse>({
        baseURL: ELFAMED_API_URL,
        url: 'Returns',
        method: 'POST',
        headers: { 'content-type': 'application/json', Authorization: `Bearer ${ELFAMED_API_AUTHORIZATION}` },
        data,
      })
      .catch((error) => {
        console.error(error);
        if (error.status === 404) {
          throw new ElfaApiNotFoundCodeError();
        }
        throw new ElfaApiError();
      });

    await this.loggingService.logApiCall('Returns', data, response);

    if (response.data?.Items?.length > 0) {
      return response.data.Items.map((item) => new ElfaApiOrderResponseModel(item));
    }
    return [];
  }

  async getDevolutionWithoutDocument(
    data: ElfmedApiDevolutionRequestModelWithoutDocument,
  ): Promise<ElfaApiOrderResponseModel[]> {
    const { ELFAMED_API_URL, ELFAMED_API_AUTHORIZATION } = ENV;

    const response = await this.httpClient
      .request<IElfaApiDevolutionResponse>({
        baseURL: ELFAMED_API_URL,
        url: 'Returns',
        method: 'POST',
        headers: { 'content-type': 'application/json', Authorization: `Bearer ${ELFAMED_API_AUTHORIZATION}` },
        data,
      })
      .catch((error) => {
        console.error(error);
        if (error.status === 404) {
          throw new ElfaApiNotFoundCodeError();
        }
        throw new ElfaApiError();
      });

    await this.loggingService.logApiCall('Returns', data, response);

    if (response.data?.Items?.length > 0) {
      return response.data.Items.map((item) => new ElfaApiOrderResponseModel(item));
    }
    return [];
  }

  async listBookItems(store: Store, productCode: string): Promise<IElfaApiPriceItem[]> {
    const page = 1;
    const pageSize = 50;
    const apiResponse = await firstValueFrom<AxiosResponse<IElfaApiPriceItemsResponse>>(
      this.httpService
        .request({
          baseURL: ENV.ELFA_API_URL,
          url: 'P-Elfa-Services-PriceBookItems',
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          auth: { username: ENV.ELFA_API_USERNAME, password: ENV.ELFA_API_PASSWORD },
          data: {
            Page: page,
            PageSize: pageSize,
            PriceBook: store.priceList,
            ProductCode: productCode.toString().padStart(7, '0'),
            UF: store.state,
          },
        })
        .pipe(retry({ count: 3, delay: 10000, resetOnSuccess: true })),
    );

    await this.loggingService.logApiCall('P-Elfa-Services-PriceBookItems', { store, productCode }, apiResponse);

    return apiResponse.data.Items;
  }

  async preInvoicedProducts(params: InvoicedProductsRequestDTO): Promise<InvoicedProductsResponseDTO> {
    const apiResponse = await firstValueFrom<AxiosResponse<InvoicedProductsResponseDTO>>(
      this.httpService
        .request({
          baseURL: ENV.ELFA_CONSIGNED_API_URL,
          url: 'v1/SendConsignedOrder',
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          auth: { username: ENV.ELFA_API_USERNAME, password: ENV.ELFA_API_PASSWORD },
          data: params,
        })
        .pipe(retry({ count: 3, delay: 10000, resetOnSuccess: true })),
    );

    await this.loggingService.logApiCall('v1/SendConsignedOrder', params, apiResponse);

    return apiResponse.data;
  }

  async getElfaCustomer(clientId: string): Promise<IElfaApiServiceCustomerItem> {
    const { ELFA_API_URL, ELFA_API_USERNAME, ELFA_API_PASSWORD } = ENV;

    const isCnpj = validateCNPJ(String(clientId));

    const response = await this.httpClient
      .request<IElfaApiServicesCustomersResponse>({
        baseURL: ELFA_API_URL,
        url: 'P-Elfa-Services-Customers',
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        auth: { username: ELFA_API_USERNAME, password: ELFA_API_PASSWORD },
        data: {
          Page: 1,
          PageSize: 10,
          ...(isCnpj && { CGC: String(clientId) }),
          ...(!isCnpj && !isNaN(Number(clientId)) && { Code: formatZeroLeft(Number(clientId), 6) }),
        },
      })
      .catch(() => {
        throw new ElfaApiError();
      });

    await this.loggingService.logApiCall('P-Elfa-Services-Customers', { clientId }, response);

    const customer = response.data.Items[0];

    return customer;
  }

  async getElfaPaymentTerms(): Promise<unknown> {
    const { ELFAMED_API_URL, ELFAMED_API_AUTHORIZATION } = ENV;
    const page = 1;
    const pageSize = 200;

    const response = await this.httpClient
      .request<IElfaApiDevolutionResponse>({
        baseURL: ELFAMED_API_URL,
        url: 'PaymentTerms',
        method: 'POST',
        headers: { 'content-type': 'application/json', Authorization: `Bearer ${ELFAMED_API_AUTHORIZATION}` },
        data: {
          Page: page,
          PageSize: pageSize,
        },
      })
      .catch((error) => {
        if (error.status === 404) {
          throw new ElfaApiNotFoundError();
        }
        throw new ElfaApiError();
      });

    await this.loggingService.logApiCall('PaymentTerms', { page, pageSize }, response);

    return response.data;
  }
}
