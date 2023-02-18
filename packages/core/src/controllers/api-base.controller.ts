import { PaginationResponse } from 'core/interfaces';
import { HttpStatus } from 'core/utils';
import { Response } from 'express';

export abstract class APIBaseController {
    protected abstract title: string;
    protected abstract module: string;

    public ok(res: Response, message = '') {
        if (!message) {
            return res.sendStatus(HttpStatus.OK);
        }
        return res.status(200).send(message);
    }

    public created<PayloadType>(
        res: Response<{ data: PayloadType }>,
        payload?: PayloadType
    ) {
        if (payload) {
            return res.status(HttpStatus.CREATED).json({ data: payload });
        }
        return res.sendStatus(HttpStatus.CREATED);
    }

    public deleted(res: Response) {
        return res.sendStatus(HttpStatus.NO_CONTENT);
    }

    public send<PayloadType>(
        res: Response<{ data: PayloadType }>,
        payload: PayloadType
    ) {
        return res.status(HttpStatus.OK).json({ data: payload });
    }

    public paginate<K>(
        res: Response<{
            data: K[];
            pagination: Omit<PaginationResponse<K>, 'data'>;
        }>,
        payload: PaginationResponse<K>
    ) {
        const { data, ...paginationMetaData } = payload;
        return res
            .status(HttpStatus.OK)
            .json({ data, pagination: paginationMetaData });
    }
}
