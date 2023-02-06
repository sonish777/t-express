import { Inject } from 'typedi';
import { UserService } from '@services';
import { Controller } from '@core/controllers';
import {
  CreateUserValidator,
  UpdateUserValidator,
} from '@validators/user.validator';
import { UserEntity } from '@entities';
import { ResourceControllerFactory } from '@core/controllers/resource.controller';

@Controller('/users')
export class UserController extends ResourceControllerFactory<
  UserEntity,
  UserService
>({
  resource: 'users',
  validators: {
    create: [CreateUserValidator],
    update: [UpdateUserValidator],
  },
}) {
  _title = 'Users';
  _viewPath = 'users';

  constructor(@Inject() readonly service: UserService) {
    super(service);
  }
}
