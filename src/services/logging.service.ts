/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiLog } from '../entities';

@Injectable()
export class LoggingService {
  constructor(
    @InjectRepository(ApiLog)
    private readonly apiLogRepository: Repository<ApiLog>,
  ) {}

  private cleanResponseData(response: Record<string, any>): Record<string, any> {
    const { status, statusText, headers, data } = response;
    return { status, statusText, headers, data };
  }

  async logApiCall(endpoint: string, request: Record<string, any>, response: Record<string, any>) {
    const log = new ApiLog();
    log.endpoint = endpoint;
    log.request = JSON.stringify(request);
    log.response = JSON.stringify(this.cleanResponseData(response));
    await this.apiLogRepository.save(log);
  }
}
