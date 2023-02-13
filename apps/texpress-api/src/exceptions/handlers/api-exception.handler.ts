import { HttpException } from 'core/exceptions';
import { ExceptionHandler } from 'core/exceptions/handlers';
import { HttpStatus } from 'core/utils/http-status-code.util';
import {
    APIErrorPayload,
    APIValidationErrorPayload,
    ApiErrorFormatter,
} from '@exceptions';

import { Request, Response, NextFunction } from 'express';

export class ApiExceptionHandler extends ExceptionHandler {
    public handle(
        error: HttpException,
        req: Request,
        res: Response,
        _next: NextFunction
    ): Response<APIErrorPayload | APIValidationErrorPayload> {
        if (!req.headers.accept || req.headers.accept !== 'application/json') {
            return res.sendStatus(HttpStatus.BAD_REQUEST);
        }
        return res
            .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
            .json(ApiErrorFormatter.format(error));
    }
}
