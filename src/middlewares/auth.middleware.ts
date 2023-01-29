import { NextFunction, Request, Response } from "express";

export const auth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        req.flash("loginError", "Please login to continue");
        return res.redirect("/auth/login");
    }
    return next();
}

export const redirectIfLoggedIn = (path = "/home") => (req: Request, res: Response, next: NextFunction) => {
    if(req.user) {
        return res.redirect(path);
    }
    return next();
};