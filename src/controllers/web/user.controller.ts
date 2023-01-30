import { Request, Response } from "express";
import { Inject } from "typedi";
import { HTTPMethods } from "@core/utils";
import { UserService } from "@services";
import { BaseController, Controller, ProtectedRoute, TypedRequest } from "@core/controllers";
import { ICreateUser } from "./interfaces/create-user.interface";
import { validationResult } from "express-validator";
import { CreateUserValidator } from "@validators/create-user.validator";

@Controller("/users")
export class UserController extends BaseController {
    _title = "Users";
    _viewPath = "users";
    _module = "users";

    constructor(@Inject() private readonly service: UserService) {
        super();
    }

    @ProtectedRoute({
        method: HTTPMethods.Get,
        path: "/"
    })
    async index(req: Request, res: Response) {
        this.page = "index";
        const data = await this.service.findAll();
        return this.render(res, data);
    }

    @ProtectedRoute({
        method: HTTPMethods.Get,
        path: "/create"
    })
    create(req: Request, res: Response) {
        this.page = "create";
        return this.render(res);
    }

    @ProtectedRoute({
        method: HTTPMethods.Post,
        path: "/",
        validators: [CreateUserValidator]
    })
    add(req: TypedRequest<ICreateUser>, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.mapped());
        }
        console.log(req.body.firstName);
        console.log(req.body.lastName);

        return res.redirect("back");
    }
}
