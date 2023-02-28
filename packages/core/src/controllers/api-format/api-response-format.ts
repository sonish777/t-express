import { MetaConstant } from 'shared/constants';
import { APIResponse } from '../interfaces';
import { PaginationOptions } from 'core/interfaces';

export class ApiResponseFormat {
    static responseFormat<K>(
        response: Pick<APIResponse<K>, 'data' | 'error'>,
        pagination?: PaginationOptions
    ) {
        const responseObject: APIResponse<K> = {};
        responseObject.meta = MetaConstant.meta;
        if (pagination) {
            responseObject.meta.pagination = pagination;
        }
        if (response.data) {
            responseObject.data = response.data;
        }
        if (response.error) {
            responseObject.error = response.error;
        }
        return responseObject;
    }
}
