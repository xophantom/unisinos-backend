import { AxiosError, AxiosResponse } from 'axios';
import esp from 'error-stack-parser';
import path from 'path';
import { format } from 'winston';
import type { TransformableInfo } from 'winston/lib/winston/logger';
import { defaultHeaderBlacklist } from './default-header-blacklist';

Error.stackTraceLimit = 64;

const parseWhere = (trace: StackFrame) => {
  if (!trace) {
    return '';
  }

  const { fileName, lineNumber = '' } = trace;

  return `${path.relative(process.cwd(), fileName)}:${lineNumber}`;
};

const filterTraces = (f: StackFrame) =>
  ![
    'Logger',
    'internal',
    'readable-stream',
    'Format.transform',
    'node_modules/winston',
    'node_modules/@sentry',
    'node_modules/express',
    'node_modules/body-parser',
    'node_modules/raw-body',
    'node_modules/morgan',
    'node:',
  ].some((s) => f.source.includes(s));

export const formatWhere = format((info) => {
  const tracer = new Error();

  const trace = esp.parse(tracer).filter(filterTraces)[0];

  return {
    ...info,
    where: parseWhere(trace),
  };
});

type ExtendedLogInfo = TransformableInfo & {
  [key: string]: unknown;
};

const isAxiosResponse = (obj: unknown): obj is AxiosResponse => {
  return (
    typeof obj === 'object' && obj !== null && 'config' in obj && 'data' in obj && 'status' in obj && 'headers' in obj
  );
};

const isError = (obj: unknown): obj is Error => {
  return typeof obj === 'object' && obj !== null && 'message' in obj && 'stack' in obj;
};

export const formatAxiosResponse = format((info: ExtendedLogInfo): ExtendedLogInfo => {
  const axiosKey = Object.keys(info).find((key) => {
    const value = info[key];
    return (
      typeof value === 'object' &&
      value !== null &&
      !('stack' in value) &&
      'config' in value &&
      typeof value.config === 'object' &&
      value.config !== null &&
      'headers' in value.config &&
      typeof value.config.headers === 'object' &&
      value.config.headers !== null &&
      'User-Agent' in value.config.headers &&
      typeof value.config.headers['User-Agent'] === 'string' &&
      value.config.headers['User-Agent'].includes('axios')
    );
  });

  if (axiosKey && isAxiosResponse(info[axiosKey])) {
    const response = info[axiosKey];
    const {
      config: { headers: reqHeaders, method, baseURL, url, data, params },
      data: bodyRes,
      headers: resHeaders,
      status,
    } = response;

    if (reqHeaders) {
      Object.keys(reqHeaders).forEach((header) => {
        if (defaultHeaderBlacklist.some((s) => s.toLowerCase() === header.toLowerCase())) {
          delete reqHeaders[header];
        }
      });
    }

    if (resHeaders) {
      Object.keys(resHeaders).forEach((header) => {
        if (defaultHeaderBlacklist.some((s) => s.toLowerCase() === header.toLowerCase())) {
          delete resHeaders[header];
        }
      });
    }

    return {
      ...info,
      axiosKey: {
        req: {
          headers: reqHeaders,
          method,
          baseURL,
          url,
          data,
          params,
        },
        res: {
          data: bodyRes,
          headers: resHeaders,
          status,
        },
      },
    };
  }

  return info;
});

const formatAxiosError = (axiosError: AxiosError) => {
  const {
    message,
    config: { headers: cfgHeaders, method, baseURL, url, data, params },
    code,
    response,
  } = axiosError;

  let body = response.data;

  if (typeof response.data === 'string' && response.data.startsWith('<')) {
    body = '<...HTML RESPONSE...>';
  }

  Object.keys(cfgHeaders).forEach((header) => {
    if (defaultHeaderBlacklist.some((s) => s.toLowerCase() === header.toLowerCase())) {
      delete cfgHeaders[header];
    }
  });

  return {
    message,
    code,
    config: {
      headers: cfgHeaders,
      method,
      baseURL,
      url,
      data: typeof data === 'string' && data.startsWith('{') ? JSON.parse(data) : data,
      params,
    },
    ...(response ? { response: { status: response.status, body } } : {}),
  };
};

export const formatError = format((info: ExtendedLogInfo): ExtendedLogInfo => {
  const errorKey = Object.keys(info).find((key) => isError(info[key]));

  if (errorKey && isError(info[errorKey])) {
    const error = info[errorKey];
    const stack = error.stack ? esp.parse(error).filter(filterTraces).map(parseWhere) : [];

    const { message, isAxiosError, ...otherErrorParams } = error as Error & { isAxiosError?: boolean };

    const paramsWithoutStack = { ...otherErrorParams };
    delete paramsWithoutStack.stack;

    return {
      ...info,
      errorKey: {
        message,
        ...(isAxiosError ? formatAxiosError(error as AxiosError) : paramsWithoutStack),
        stack,
      },
    };
  }

  return info;
});

export const apiBodyFormatter = format((info) => {
  type IBody = { body: Buffer | string };
  const { req, res } = (info.api as { req: IBody; res: IBody }) || {};
  if (req) {
    if (Buffer.isBuffer(req.body)) {
      req.body = req.body.toString('utf8');
    }
  }
  if (res) {
    if (Buffer.isBuffer(res.body)) {
      res.body = res.body.toString('utf8');
    }
    if (typeof res.body === 'string' && res.body.startsWith('<')) {
      res.body = '<...HTML RESPONSE...>';
    }
  }
  return info;
});

export const orderFormatter = format((info) => {
  const { meta, ...rest } = info;
  return {
    meta,
    ...rest,
  };
});

export const formatZeroLeft = (code?: number | null, maxLength: number = 7): string | null =>
  // Formatar o código para uma string com 7 zeros à esquerda por padrão
  code ? String(code).padStart(maxLength, '0') : null;

export const formatZeroLeftString = (code?: string | null, maxLength: number = 7): string | null =>
  // Formatar o código para uma string com 7 zeros à esquerda por padrão
  code ? code.padStart(maxLength, '0') : null;
