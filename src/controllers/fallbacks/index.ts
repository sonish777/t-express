import { Controller, Route } from '@core/controllers';
import { HttpException } from '@core/exceptions';
import { HTTPMethods } from '@core/utils';
import { NextFunction, Request, Response } from 'express';

@Controller('*', { fallback: true })
export class FallbackController {
  @Route({
    path: '',
    method: HTTPMethods.All,
  })
  handleFallback(_req: Request, _res: Response, next: NextFunction) {
    return next(new HttpException(404, 'Not found'));
  }
}
