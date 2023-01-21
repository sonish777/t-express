import { Request, Response } from "express";
import { Controller, Route } from "../core/decorators";
import { HTTPMethods } from "../core/utils";

@Controller("/users")
export class UserController {
    @Route({
        method: HTTPMethods.Get,
        path: "/"
    })
    findAll(req: Request, res: Response) {
        return res.status(200).json({
            status: "OK",
            data: [
                { id: 1, name: "Sonish Maharjan" },
                { id: 2, name: "Binita Shrestha" }
            ]
        });
    }
}
