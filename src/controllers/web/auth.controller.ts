import { Request, Response } from "express";
import passport from "passport";
import { BaseController, Controller, Route } from "@core/controllers";
import { HTTPMethods } from "@core/utils";

@Controller("/auth")
export class AuthController extends BaseController {
    _title = "Auth";
    _viewPath = "auth";

    @Route({
        path: "/login",
        method: HTTPMethods.Get
    })
    loginView(req: Request, res: Response) {
        this.page = "login";
        this.render(res);
    }

    @Route({
        path: "/login",
        method: HTTPMethods.Post,
        middlewares: [
            passport.authenticate("local", {
                failureRedirect: "/auth/login"
            })
        ]
    })
    login(_req: Request, res: Response) {
        return res.redirect("/users");
    }
}
