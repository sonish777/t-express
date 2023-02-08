import { PaginationResponse } from '@core/interfaces';
import { HttpStatus } from '@core/utils/http-status-code.util';
import { Response } from 'express';

export abstract class APIBaseController {
  protected abstract title: string;
  protected abstract module: string;

  public ok(res: Response) {
    return res.sendStatus(HttpStatus.OK);
  }

  public created<PayloadType>(
    res: Response<PayloadType>,
    payload?: PayloadType
  ) {
    return res.status(HttpStatus.CREATED).json(payload);
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
