import { AxiosResponse } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';

export abstract class HttpClientError extends Error {}

export class ProtocolError extends HttpClientError {
  public name: string = ProtocolError.name;

  public message: string;

  public data: unknown;

  public status: number;

  public headers: { [key: string]: any };

  constructor(message: string, { data, status, headers }: AxiosResponse) {
    super();
    this.message = message;
    this.data = data;
    this.status = status;
    this.headers = headers;
  }
}

export class RequestError extends HttpClientError {
  public name: string = RequestError.name;

  constructor(public message: string) {
    super();
  }
}
