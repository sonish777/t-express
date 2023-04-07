import { PermissionService } from '@cms/services';
import { EditPermissionValidator } from '@cms/validators';
import {
    CanAccess,
    Controller,
    ResourceControllerFactory,
} from 'core/controllers';
import { Request, Response } from 'express';
import { Publisher } from 'rabbitmq';
import { PermissionEntity } from 'shared/entities';

@Controller('/permissions')
@CanAccess
export class PermissionController extends ResourceControllerFactory<
    PermissionEntity,
    PermissionService
>({
    resource: 'permissions',
    validators: {
        update: [EditPermissionValidator],
    },
}) {
    public _title = 'Permissions';
    public _viewPath = 'permissions';

    constructor(
        public readonly service: PermissionService,
        public readonly publisher: Publisher
    ) {
        super(service, publisher);
    }

    async index(_req: Request, res: Response): Promise<void> {
        this.page = 'index';
        this.setBreadcrumbs(this.indexBreadcrumbs);
        const modulePermissions = await this.service.getModulePermissions();
        return this.render(res, { modulePermissions });
    }
}
