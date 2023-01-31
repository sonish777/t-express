import { Request } from 'express';

export interface TypedRequest<K> extends Request {
  body: K;
}
