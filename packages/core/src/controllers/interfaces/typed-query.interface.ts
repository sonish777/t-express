import { Request } from 'express';

export interface TypedQuery<Query> extends Request {
    query: Query & {};
}
