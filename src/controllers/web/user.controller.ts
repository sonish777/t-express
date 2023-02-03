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
import { TypedQuery } from '@core/controllers/interfaces/typed-query.interface';
import { CommonSearchQuery } from '@core/interfaces';

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
  async index(req: TypedQuery<CommonSearchQuery>, res: Response) {
    this.page = 'index';
    const data = await this.service.paginate({
      ...req.query,
    });
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
