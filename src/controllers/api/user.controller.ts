import { Request, Response } from "express";
import { Controller, Route } from "../../core/decorators";
import { HTTPMethods } from "../../core/utils";
import { UserService } from "../../services";

@Controller("/api/v1/users")
export class ApiUserController {
    constructor(private readonly service: UserService) {}

    @Route({
        method: HTTPMethods.Get,
        path: "/"
    })
    findAll(req: Request, res: Response) {
        const data = this.service.findAll();
        return res.status(200).json({
            status: "OK",
            data
        });
    }
}
