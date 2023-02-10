import { Request, Response } from 'express';
import { Inject } from 'typedi';
import { Controller, ProtectedRoute, TypedBody } from 'core/controllers';
import { ResourceControllerFactory } from 'core/controllers/resource.controller';
import { HTTPMethods } from 'core/utils';
import { RoleService } from '@services/role.service';
import { CanAccess } from 'core/controllers/decorators/can-access.decorator';
import { CatchAsync } from 'core/exceptions/decorators/catch-async.decorator';
import { RoleEntity } from 'shared/entities';
import { CreateRoleValidator } from 'shared/validators';
import { CreateRole } from 'shared/dtos';

@Controller('/roles')
@CanAccess
export class RoleController extends ResourceControllerFactory<
    RoleEntity,
    RoleService
>({
    resource: 'roles',
    validators: { update: [CreateRoleValidator] },
}) {
    public _title = 'Roles';
    public _viewPath = 'roles';

    constructor(@Inject() readonly service: RoleService) {
        super(service);
    }

    @ProtectedRoute({
        method: HTTPMethods.Get,
        path: '/create',
    })
    @CatchAsync
    async create(_req: Request, res: Response) {
        this.page = 'create';
        const data = await this.service.getModulePermissions();
        return this.render(res, { data });
    }

    @ProtectedRoute({
        method: HTTPMethods.Post,
        path: '/',
        validators: [CreateRoleValidator],
    })
    @CatchAsync
    async add(req: TypedBody<CreateRole>, res: Response) {
        await this.service.createRoleWithPermissions(req.body);
        return res.redirect('/roles');
    }

    @ProtectedRoute({
        method: HTTPMethods.Get,
        path: '/:id',
    })
    @CatchAsync
    async edit(req: Request, res: Response) {
        this.page = 'edit';
        const id = Number(req.params.id);
        const permissions = await this.service.getModulePermissions();
        const role = await this.service.findOne({ id }, ['permissions']);
        this.render(res, {
            role: { ...role, permissions: role?.permissions?.map((p) => p.id) },
            permissions,
        });
    }
}
