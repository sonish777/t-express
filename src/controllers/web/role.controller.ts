import { Controller } from '@core/controllers';
import { ResourceControllerFactory } from '@core/controllers/resource.controller';
import { RoleEntity } from '@entities';
import { RoleService } from '@services/role.service';
import { CreateRoleValidator } from '@validators/role.validator';
import { Inject } from 'typedi';

@Controller('/roles')
export class RoleController extends ResourceControllerFactory<
  RoleEntity,
  RoleService
>({
  resource: 'roles',
  validators: {
    create: [CreateRoleValidator],
  },
}) {
  public _title = 'Roles';
  public _viewPath = 'roles';

  constructor(@Inject() readonly service: RoleService) {
    super(service);
  }
}
