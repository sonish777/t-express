import { PaginationOptions } from 'core/interfaces';
import { APIErrorPayload, APIValidationErrorPayload } from '@api/exceptions';

export interface APIResponse<K> {
    meta?: MetaInterface;
    error?: Partial<APIErrorPayload> | Partial<APIValidationErrorPayload>;
    data?: K;
}

export interface MetaInterface {
    copyright: string;
    email: string;
    api: Record<string, string>;
    pagination?: PaginationOptions;
}
