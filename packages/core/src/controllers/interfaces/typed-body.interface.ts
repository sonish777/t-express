import { Request } from 'express';

export interface TypedBody<K> extends Request {
    body: K;
}
