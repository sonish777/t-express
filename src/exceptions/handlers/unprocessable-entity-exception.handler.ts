import { ExceptionHandler } from "@core/exceptions/handlers";
import { HttpStatus } from "@core/utils/http-status-code.util";
import { UnprocessableEntityException } from "@exceptions/unprocessable-entity.exception";
import { Request, Response, NextFunction } from "express";

export class UnprocessableEntityExceptionHandler extends ExceptionHandler {
    public handle(error: UnprocessableEntityException, req: Request, res: Response, next: NextFunction): void {
        if(error.statusCode !== HttpStatus.UNPROCESSABLE_ENTITY) {
            return next(error);
        }
        req.flash('errors', error.validationResult);
        req.flash('inputData', req.body);
        return res.redirect("back");
    }
} 