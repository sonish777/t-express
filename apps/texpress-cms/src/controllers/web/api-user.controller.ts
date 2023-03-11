import {
    CanAccess,
    Controller,
    ProtectedRoute,
    ResourceControllerFactory,
    TypedBody,
} from 'core/controllers';
import { CatchAsync } from 'core/exceptions';
import { Breadcrumb } from 'core/interfaces';
import { HTTPMethods } from 'core/utils';
import { Response } from 'express';
import { Publisher } from 'rabbitmq';
import { ApiUserEntity } from 'shared/entities';
import { ApiUserService } from 'shared/services';

@Controller('/api-users')
@CanAccess
export class ApiUserController extends ResourceControllerFactory<
    ApiUserEntity,
    ApiUserService
>({
    resource: 'api-users',
}) {
    public _title = 'Frontend Users';
    public _viewPath = 'api-users';
    public indexBreadcrumbs: Breadcrumb[] = [
        { name: 'Frontend Users', url: '/api-users' },
    ];

    constructor(
        public readonly service: ApiUserService,
        public readonly publisher: Publisher
    ) {
        super(service, publisher);
    }

    @ProtectedRoute({
        path: '/:id/toggle-status',
        method: HTTPMethods.Put,
    })
    @CatchAsync
    async toggleUserStatus(req: TypedBody<{ status: string }>, res: Response) {
        const id = req.params.id;
        await this.service.update(Number(id), req.body);
        req.flash('message:toast', 'User status updated successfully');
        return res.redirect('back');
    }
}
