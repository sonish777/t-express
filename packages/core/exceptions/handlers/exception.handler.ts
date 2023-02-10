import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../http.exception';

export abstract class ExceptionHandler {
  public abstract handle(
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
  ): void;
}
