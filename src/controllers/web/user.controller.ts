import { Request, Response } from 'express';
import { Inject } from 'typedi';
import { HTTPMethods } from '@core/utils';
import { UserService } from '@services';
import {
  BaseController,
  Controller,
  ProtectedRoute,
  TypedBody,
} from '@core/controllers';
import { CreateUser } from './interfaces/create-user.interface';
import { CreateUserValidator } from '@validators/create-user.validator';

@Controller('/users')
export class UserController extends BaseController {
  _title = 'Users';
  _viewPath = 'users';
  _module = 'users';

  constructor(@Inject() private readonly service: UserService) {
    super();
  }

  @ProtectedRoute({
    method: HTTPMethods.Get,
    path: '/',
  })
  async index(req: Request, res: Response) {
    this.page = 'index';
    const data = await this.service.findAll();
    return this.render(res, data);
  }

  @ProtectedRoute({
    method: HTTPMethods.Get,
    path: '/create',
  })
  create(_req: Request, res: Response) {
    this.page = 'create';
    return this.render(res);
  }

  @ProtectedRoute({
    method: HTTPMethods.Post,
    path: '/',
    validators: [CreateUserValidator],
  })
  async add(req: TypedBody<CreateUser>, res: Response) {
    await this.service.create(req.body);
    req.flash('message', 'User created successfully');
    return res.redirect('back');
  }
}
