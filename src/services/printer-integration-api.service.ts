import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PrinterIntegrationApiError, PrinterLabelIntegrationApiError } from 'src/errors';
import { ENV } from '../config/env';
import { PrinterIntegrationApiRequestModel, PrinterLabelIntegrationApiRequestModel } from '../domain';
import { HttpClientService } from './http-client.service';
import { logger } from '../tools';

@Injectable()
export class PrinterIntegrationApiService {
  private readonly httpClient: HttpClientService;

  constructor(private readonly httpService: HttpService) {
    this.httpClient = new HttpClientService(this.httpService);
  }

  // * Impressora fixa
  async print(data: PrinterIntegrationApiRequestModel): Promise<void> {
    if (!ENV.PRINTER_INTEGRATION_API_ENABLE) {
      logger.debug('Printer integration API is disabled');
      return;
    }

    const requestConfig = {
      baseURL: ENV.PRINTER_INTEGRATION_API_URL,
      url: 'print',
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      auth: { username: ENV.PRINTER_INTEGRATION_API_USERNAME, password: ENV.PRINTER_INTEGRATION_API_PASSWORD },
      data,
      validateStatus: (status: number) => (status >= 200 && status < 300) || status === 503,
    };

    const response = await this.httpClient.request(requestConfig).catch(() => {
      throw new PrinterIntegrationApiError();
    });
    if (response.status === 503) {
      throw new PrinterIntegrationApiError(response.data);
    }
  }

  // * Impressora portátil (Virtual)
  async printLabel(data: PrinterLabelIntegrationApiRequestModel): Promise<string[]> {
    if (!ENV.PRINTER_INTEGRATION_API_ENABLE) {
      logger.debug('Printer integration API is disabled');
      return ['Printer integration API is disabled'];
    }

    const requestConfig = {
      baseURL: ENV.PRINTER_INTEGRATION_API_URL,
      url: 'print/labels',
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      auth: { username: ENV.PRINTER_INTEGRATION_API_USERNAME, password: ENV.PRINTER_INTEGRATION_API_PASSWORD },
      data,
      validateStatus: (status: number) => (status >= 200 && status < 300) || status === 503,
    };

    const response = await this.httpClient.request<string[]>(requestConfig).catch(() => {
      throw new PrinterIntegrationApiError();
    });
    if (response.status === 503) {
      throw new PrinterLabelIntegrationApiError();
    }

    return response.data;
  }
}
