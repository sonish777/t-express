import { Request } from 'express';

export interface ProtectedRequest extends Request {
    user: NonNullable<Request['user']>;
}
