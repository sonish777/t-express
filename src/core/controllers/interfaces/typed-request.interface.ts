import { Request } from 'express';

export type TypedRequest<K> = Request & {
  body: K;
};
