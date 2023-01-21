import { Request, Response } from "express";
import { Controller, Route } from "../core/decorators";
import { HTTPMethods } from "../core/utils";

@Controller("/base")
export class BaseController {
    @Route({
        method: HTTPMethods.Get,
        path: "/"
    })
    health(req: Request, res: Response) {
        res.status(200).json({
            status: "OK",
            message: "Welcome to TExpress"
        });
    }
}
