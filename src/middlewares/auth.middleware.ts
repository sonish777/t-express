import { NextFunction, Request, Response } from "express";

export const auth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        req.flash("error", "Please login to continue");
        return res.redirect("/auth/login");
    }
    return next();
}