import { Inject } from 'typedi';
import { UserService } from '@services';
import { Controller } from 'core/controllers';
import { ResourceControllerFactory } from 'core/controllers/resource.controller';
import { CanAccess } from 'core/controllers/decorators/can-access.decorator';
import { UserEntity } from 'shared/entities';
import { CreateUserValidator, UpdateUserValidator } from 'shared/validators';

@Controller('/users')
@CanAccess
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
