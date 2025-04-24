import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { SortQueryPipe } from '../pipes';

const queryPipe = new SortQueryPipe();

export const SortQuery = createParamDecorator((name: string, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<Request>();

  const value = req.query[name] as string;

  queryPipe.transform(value, {
    data: name,
    type: 'query',
  });

  return value;
});
