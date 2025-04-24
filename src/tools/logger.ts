/* eslint-disable no-param-reassign */
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import type { Request, Response } from 'express';
import expressWinston from 'express-winston';
import {
  createLogger,
  format,
  Logger as WinstonLogger,
  transports,
} from 'winston';
import { z } from 'zod';
import {
  apiBodyFormatter,
  formatAxiosResponse,
  formatError,
  formatWhere,
  orderFormatter,
} from './custom-formats';
import { ILoggerOptions, ILoggerLevel } from '../domain';
import { logLevels } from './log-levels';
import { defaultHeaderBlacklist } from './default-header-blacklist';

const booleanLike = z.preprocess((value) => {
  if (value) {
    if (typeof value === 'object') {
      return Array.isArray(value)
        ? !!value.length
        : !!Object.keys(value ?? {}).length;
    }

    return JSON.parse(value as string);
  }

  return !!value;
}, z.boolean());

type LoggerMiddlewareOptions = {
  defaultLevel?: ILoggerLevel;
  requestWhitelist?: string[];
  responseWhitelist?: string[];
  headerBlacklist?: string[];
  errorsLevel?: {
    [code: string]: ILoggerLevel;
  };
};

type IAnyObject = Record<string, any>;

export class Logger {
  public logger: WinstonLogger;

  private readonly options: ILoggerOptions;

  static defaultOptions: LoggerMiddlewareOptions = {
    defaultLevel: 'info',
    requestWhitelist: [],
    responseWhitelist: [],
    headerBlacklist: defaultHeaderBlacklist,
    errorsLevel: {
      '404': 'debug',
    },
  };

  constructor(options: ILoggerOptions = {}) {
    this.options = {
      level:
        options.level ||
        (process.env.LOGGER_LEVEL?.toLowerCase() as ILoggerLevel) ||
        'debug',
      prettyPrint:
        options.prettyPrint ??
        booleanLike.default(true).parse(process.env.LOGGER_PRETTY),
      colorize:
        options.colorize ??
        booleanLike.default(true).parse(process.env.LOGGER_COLORIZE),
    };

    const formatTag = format((info) => info);

    this.logger = createLogger({
      levels: logLevels.levels,
      level: this.options.level,
      format: format.combine(
        ...[
          formatError(),
          formatAxiosResponse(),
          apiBodyFormatter(),
          format.metadata({ key: 'meta' }),
          formatWhere(),
          formatTag(),
          format.timestamp(),
          ...(this.options.label
            ? [format.label({ label: this.options.label })]
            : []),
          ...(this.options.customFormat ? [this.options.customFormat] : []),
          format.json(),
          orderFormatter(),
        ],
      ),
      exitOnError: false,
    });

    this.logger.add(
      new transports.Console({
        format: format.combine(
          ...[
            ...(!this.options.simple && this.options.prettyPrint
              ? [format.prettyPrint({ colorize: this.options.colorize })]
              : []),
            ...(this.options.colorize
              ? [format.colorize({ all: true, colors: logLevels.colors })]
              : []),
          ],
        ),
      }),
    );
  }

  public expressLogger(options: LoggerMiddlewareOptions = {}) {
    const {
      defaultLevel,
      requestWhitelist,
      responseWhitelist,
      errorsLevel,
      headerBlacklist,
    } = { ...Logger.defaultOptions, ...options };

    expressWinston.requestWhitelist = [
      'url',
      'headers',
      'method',
      'query',
      'body',
      ...requestWhitelist,
    ];
    expressWinston.responseWhitelist = [
      'statusCode',
      'headers',
      'body',
      'responseTime',
      ...responseWhitelist,
    ];

    return [
      (_, res, next) => {
        const end = res.end.bind(res);
        res.end = (chunk, encode) => {
          res.headers = { ...res.getHeaders() };
          end(chunk, encode);
        };
        next();
      },
      expressWinston.logger({
        metaField: 'api',
        msg: 'Express Logger',
        dynamicMeta: (req, res) => {
          const request = {};

          expressWinston.requestWhitelist.forEach((param) => {
            request[param] = req[param];
          });

          const response = {};

          expressWinston.responseWhitelist.forEach((param) => {
            response[param] = res[param];
          });

          return {
            req: request,
            res: response,
          };
        },
        headerBlacklist,
        winstonInstance: this.logger,
        level: (_req: Request, res: Response): ILoggerLevel => {
          const code = res.statusCode;

          if (errorsLevel?.[code]) {
            return errorsLevel[code];
          }

          if (code >= 500) return 'crit';

          if (code >= 400) return 'error';

          return defaultLevel;
        },
      }),
    ];
  }

  public axiosLogger(options?: {
    axiosInstance?: AxiosInstance;
    defaultLevel?: ILoggerLevel;
    errorLevel?: ILoggerLevel;
  }) {
    const {
      axiosInstance = axios,
      defaultLevel = 'info',
      errorLevel = 'error',
    } = options || {};
    const axiosRequestLogger = (config: InternalAxiosRequestConfig<any>) =>
      config;

    const axiosResponseLogger = (fetch: AxiosResponse<any, any>) => {
      this.log(defaultLevel, 'External Request', { fetch });
      return fetch;
    };

    const axiosRejectLogger = (fetchError: any) => {
      this.log(errorLevel, 'External Request Error', { fetchError });
      throw fetchError;
    };

    axiosInstance.interceptors.request.use(
      axiosRequestLogger,
      axiosRejectLogger,
    );

    axiosInstance.interceptors.response.use(
      axiosResponseLogger,
      axiosRejectLogger,
    );
  }

  private log(level: string, message: any, ...meta: IAnyObject[]) {
    if (typeof message !== 'string') {
      meta = [message, ...meta];
      message = '';
    }

    Object.keys(meta).forEach((key) => {
      if (meta[key] instanceof Error) {
        meta[key] = { error: meta[key] };
      }

      if (meta[key]?.config?.headers?.['User-Agent']?.includes('axios')) {
        meta[key] = { axiosResponse: meta[key] };
      }
    });

    return this.logger.log(level, message, ...meta);
  }

  public emerg(message: string, ...meta: IAnyObject[]);

  public emerg(...meta: IAnyObject[]);

  public emerg(message: any, ...meta: IAnyObject[]) {
    return this.log('emerg', message, ...meta);
  }

  public alert(message: string, ...meta: IAnyObject[]);

  public alert(...meta: IAnyObject[]);

  public alert(message: any, ...meta: IAnyObject[]) {
    return this.log('alert', message, ...meta);
  }

  public crit(message: string, ...meta: IAnyObject[]);

  public crit(...meta: IAnyObject[]);

  public crit(message: any, ...meta: IAnyObject[]) {
    return this.log('crit', message, ...meta);
  }

  public error(message: string, ...meta: IAnyObject[]);

  public error(...meta: IAnyObject[]);

  public error(message: any, ...meta: IAnyObject[]) {
    return this.log('error', message, ...meta);
  }

  public warning(message: string, ...meta: IAnyObject[]);

  public warning(...meta: IAnyObject[]);

  public warning(message: any, ...meta: IAnyObject[]) {
    return this.log('warning', message, ...meta);
  }

  public warn(message: string, ...meta: IAnyObject[]);

  public warn(...meta: IAnyObject[]);

  public warn(message: any, ...meta: IAnyObject[]) {
    return this.warning(message, ...meta);
  }

  public notice(message: string, ...meta: IAnyObject[]);

  public notice(...meta: IAnyObject[]);

  public notice(message: any, ...meta: IAnyObject[]) {
    return this.log('notice', message, ...meta);
  }

  public info(message: string, ...meta: IAnyObject[]);

  public info(...meta: IAnyObject[]);

  public info(message: any, ...meta: IAnyObject[]) {
    return this.log('info', message, ...meta);
  }

  public debug(message: string, ...meta: IAnyObject[]);

  public debug(...meta: IAnyObject[]);

  public debug(message: any, ...meta: IAnyObject[]) {
    return this.log('debug', message, ...meta);
  }

  public trace(message: string, ...meta: IAnyObject[]);

  public trace(...meta: IAnyObject[]);

  public trace(message: any, ...meta: IAnyObject[]) {
    return this.log('trace', message, ...meta);
  }

  public startTimer() {
    return this.logger.startTimer();
  }

  public profile(id: string | number, meta?: any) {
    return this.logger.profile(id, meta);
  }

  public time(id: string | number) {
    return this.logger.profile(id);
  }

  public timeEnd(id: string | number, meta?: any) {
    return this.logger.profile(id, meta);
  }
}
