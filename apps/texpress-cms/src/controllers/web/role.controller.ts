import { Request, Response } from 'express';
import { Controller, ProtectedRoute, TypedBody } from 'core/controllers';
import { ResourceControllerFactory } from 'core/controllers';
import { HTTPMethods } from 'core/utils';
import { RoleService } from '@cms/services';
import { CanAccess } from 'core/controllers';
import { CatchAsync } from 'core/exceptions';
import { RoleEntity } from 'shared/entities';
import { CreateRoleValidator } from 'shared/validators';
import { CreateRole } from 'shared/dtos';
import { Publisher } from 'rabbitmq';

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

    constructor(
        public readonly service: RoleService,
        public readonly publisher: Publisher
    ) {
        super(service, publisher);
    }

    @ProtectedRoute({
        method: HTTPMethods.Get,
        path: '/create',
    })
    @CatchAsync
    async create(_req: Request, res: Response) {
        this.page = 'create';
        this.setBreadcrumbs([
            ...this.indexBreadcrumbs,
            { name: 'Create', url: '/roles/create' },
        ]);
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
        req.flash('message:toast', `Role created successfully`);
        return res.redirect('/roles');
    }

    @ProtectedRoute({
        method: HTTPMethods.Get,
        path: '/:id',
    })
    @CatchAsync
    async edit(req: Request, res: Response) {
        const id = Number(req.params.id);
        this.page = 'edit';
        this.setBreadcrumbs([
            ...this.indexBreadcrumbs,
            { name: 'Edit', url: `/roles/${id}` },
        ]);
        const permissions = await this.service.getModulePermissions();
        const role = await this.service.findOne({ id }, ['permissions']);
        this.render(res, {
            role: { ...role, permissions: role?.permissions?.map((p) => p.id) },
            permissions,
        });
    }
}
