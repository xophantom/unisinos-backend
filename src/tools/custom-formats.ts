import { AxiosError, AxiosResponse } from 'axios';
import esp from 'error-stack-parser';
import path from 'path';
import { format } from 'winston';
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

export const formatAxiosResponse = format((info) => {
  const axiosKey = Object.keys(info).find(
    (key) => !info[key]?.stack && info[key]?.config?.headers?.['User-Agent']?.includes('axios'),
  );
  if (axiosKey) {
    const {
      config: { headers: reqHeaders, method, baseURL, url, data, params },
      data: bodyRes,
      headers: resHeaders,
      status,
    }: AxiosResponse = info[axiosKey];

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

export const formatError = format((info) => {
  const errorKey = Object.keys(info).find((key) => info[key] instanceof Error);

  if (errorKey) {
    const error = info[errorKey];

    const stack = error.stack ? esp.parse(error).filter(filterTraces).map(parseWhere) : [];

    const { message, isAxiosError, ...otherErrorParams } = error;

    delete otherErrorParams.stack;

    return {
      ...info,
      errorKey: {
        message,
        ...(isAxiosError ? formatAxiosError(error) : otherErrorParams),
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
