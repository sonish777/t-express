import { HttpException } from "@core/exceptions";
import { ExceptionHandler } from "@core/exceptions/handlers";
import { Request, Response, NextFunction } from "express";

class UnauthorizedExceptionHandler extends ExceptionHandler {
    public handle(error: HttpException, req: Request, res: Response, next: NextFunction): void {
        if (error.statusCode !== 401) {
            return next(error);
        }
        req.flash("error", error.message);
        return res.redirect("/auth/login");
    }
}

export const unauthorizedExceptionHandler = new UnauthorizedExceptionHandler();
