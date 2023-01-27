import { BaseController } from "@core/classes/controllers/base.controller";
import { Controller, ProtectedRoute } from "@core/decorators";
import { HTTPMethods } from "@core/utils";
import { UserService } from "@services";
import { Request, Response } from "express";
import { Inject } from "typedi";

@Controller("/users")
export class UserController extends BaseController {
    _title = "Users";
    _viewPath = "users";
    constructor(@Inject() private readonly service: UserService) {
        super();
    }

    @ProtectedRoute({
        method: HTTPMethods.Get,
        path: "/"
    })
    async findAll(req: Request, res: Response) {
        this.page = "index";
        const data = await this.service.findAll();
        return this.render(res, data);
    }
}
