import { Request } from 'express';
import { ProtectedRequest } from './typed-request.interface';

export interface TypedBody<K> extends Request {
    body: K;
}

export interface ProtectedTypedBody<K> extends ProtectedRequest {
    body: K;
}
