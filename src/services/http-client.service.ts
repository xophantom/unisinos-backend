import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { catchError, firstValueFrom, retry, throwError, timeout } from 'rxjs';
import { logger } from '../tools';
import { ProtocolError, RequestError } from '../errors';

export class HttpClientService {
  constructor(private readonly httpService: HttpService) {}

  request<T>(
    requestConfig: AxiosRequestConfig,
    sensitiveHeaders: string[] = ['authorization', 'auth'],
  ): Promise<AxiosResponse<T>> {
    return firstValueFrom(
      this.httpService.request<T>(requestConfig).pipe(
        timeout(30000),
        retry(3),
        catchError((error) => {
          const { request, response, message, config } = error;

          if (config) {
            sensitiveHeaders.forEach((s) => {
              delete config.headers[s];
              delete config[s];
            });
          }

          if (response) {
            this.handleProtocolELogger(error);
            return throwError(() => new ProtocolError(message, error.response));
          }
          if (request) {
            this.handleCommunicationELogger(error);
          } else {
            this.handleInvalidConfigELogger(error);
          }
          return throwError(() => new RequestError(message));
        }),
      ),
    );
  }

  private handleProtocolELogger({ response, message, config }: AxiosError) {
    logger.error('Protocol error while sending http request.', {
      message,
      response: {
        status: response?.status,
        statusText: response?.statusText,
        data: response?.data,
      },
      config,
    });
  }

  private handleCommunicationELogger({ request, message, config }: AxiosError) {
    logger.error('Communication error while sending http request.', {
      message,
      request: {
        method: request?.method,
        url: request?.url,
        data: request?.data,
      },
      config,
    });
  }

  private handleInvalidConfigELogger({ message, config }: AxiosError) {
    logger.error('Error while setting up the request.', { message, config });
  }
}
