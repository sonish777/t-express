import { Request, Response } from "express";
import { Inject } from "typedi";
import { BaseController } from "../../core/classes/controllers/base.controller";
import { Controller, Route } from "../../core/decorators";
import { HTTPMethods } from "../../core/utils";
import { UserService } from "../../services";

@Controller("/users")
export class UserController extends BaseController {
    _title = 'Users';
    _viewPath = 'users';
    constructor(
        @Inject() private readonly service: UserService) {super();}

    @Route({
        method: HTTPMethods.Get,
        path: "/"
    })
    async findAll(req: Request, res: Response) {
        this.page = 'index';
        const data = await this.service.findAll();
        return this.render(res, data);
    }
}
