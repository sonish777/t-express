import { PaginationResponse } from 'core/interfaces';
import { HttpStatus } from 'core/utils';
import { Response } from 'express';
import { ApiResponseFormat } from './api-format';
import { APIResponse } from './interfaces';

export abstract class APIBaseController {
    protected abstract title: string;
    protected abstract module: string;

    public ok(res: Response, message = '') {
        if (!message) {
            return res.sendStatus(HttpStatus.OK);
        }
        return res
            .status(200)
            .send(ApiResponseFormat.responseFormat({ data: message }));
    }

    public created<PayloadType>(
        res: Response<APIResponse<PayloadType>>,
        payload?: PayloadType
    ) {
        if (payload) {
            return res
                .status(HttpStatus.CREATED)
                .send(ApiResponseFormat.responseFormat({ data: payload }));
        }
        return res.sendStatus(HttpStatus.CREATED);
    }

    public deleted(res: Response) {
        return res.sendStatus(HttpStatus.NO_CONTENT);
    }

    public send<PayloadType>(
        res: Response<APIResponse<PayloadType>>,
        payload: PayloadType
    ) {
        return res
            .status(HttpStatus.OK)
            .send(ApiResponseFormat.responseFormat({ data: payload }));
    }

    public paginate<K>(
        res: Response<APIResponse<K[]>>,
        payload: PaginationResponse<K>
    ) {
        const { data, ...paginationMetaData } = payload;
        return res
            .status(HttpStatus.OK)
            .send(
                ApiResponseFormat.responseFormat({ data }, paginationMetaData)
            );
    }
}
