import { UserService } from '@cms/services';
import {
    Controller,
    CanAccess,
    ProtectedRoute,
    TypedBody,
} from 'core/controllers';
import { ResourceControllerFactory } from 'core/controllers';
import { AdminActivityLogEntity, UserEntity } from 'shared/entities';
import { CreateUserValidator, UpdateUserValidator } from 'shared/validators';
import { HTTPMethods } from 'core/utils';
import { Request, Response } from 'express';
import { CreateUserDto, UpdateUserDto } from '@cms/dtos';
import { CatchAsync } from 'core/exceptions';
import { Publisher } from 'rabbitmq';
import { QueueConfig } from 'shared/configs';

@Controller('/users')
@CanAccess
export class UserController extends ResourceControllerFactory<
    UserEntity,
    UserService
>({
    resource: 'users',
    findRelations: ['role'],
    validators: {
        create: [CreateUserValidator],
        update: [UpdateUserValidator],
    },
}) {
    _title = 'Users';
    _viewPath = 'users';

    constructor(
        public readonly service: UserService,
        public readonly publisher: Publisher
    ) {
        super(service, publisher);
    }

    @CatchAsync
    async create(_req: Request, res: Response) {
        this.page = 'create';
        this.setBreadcrumbs([
            ...this.indexBreadcrumbs,
            { name: 'Create', url: '/users/create' },
        ]);
        const roles = await this.service.getRolesForDropdown();
        return this.render(res, { roles });
    }

    @CatchAsync
    async add(req: TypedBody<CreateUserDto>, res: Response) {
        await this.service.createUser(req.body);
        this.publisher.publish<Partial<AdminActivityLogEntity>>(
            QueueConfig.Cms.Exchange,
            QueueConfig.Cms.ActivityLogQueue,
            {
                module: 'Admins',
                action: 'Create',
                description: 'Created a new admin user',
                userId: req.user!.id,
                activityTimestamp: new Date(),
            }
        );
        req.flash('message:toast', 'User created successfully');
        return res.redirect('back');
    }

    @CatchAsync
    async edit(req: Request, res: Response) {
        const id = req.params.id;
        this.page = 'edit';
        this.setBreadcrumbs([
            ...this.indexBreadcrumbs,
            { name: 'Edit', url: `/users/${id}` },
        ]);
        const user = await this.service.findOne({ id: Number(id) }, ['role']);
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('back');
        }
        const roles = await this.service.getRolesForDropdown();
        return this.render(res, {
            user: { ...user, roleId: user.role?.[0]?._id },
            roles,
        });
    }

    @CatchAsync
    async update(req: TypedBody<UpdateUserDto>, res: Response): Promise<void> {
        const id = req.params.id;
        const updatedUser = await this.service.updateUser(Number(id), req.body);
        this.publisher.publish<Partial<AdminActivityLogEntity>>(
            QueueConfig.Cms.Exchange,
            QueueConfig.Cms.ActivityLogQueue,
            {
                module: 'Admins',
                action: 'Update',
                description: `Updated the details of admin @ ${updatedUser.email}`,
                userId: req.user!.id,
                activityTimestamp: new Date(),
            }
        );
        req.flash('message:toast', 'User details updated successfully');
        return res.redirect('back');
    }

    @ProtectedRoute({ method: HTTPMethods.Put, path: '/:id/toggle-status' })
    @CatchAsync
    async toggleStatus(req: TypedBody<{ status: string }>, res: Response) {
        const id = req.params.id;
        const updatedUser = await this.service.update(Number(id), req.body);
        this.publisher.publish<Partial<AdminActivityLogEntity>>(
            QueueConfig.Cms.Exchange,
            QueueConfig.Cms.ActivityLogQueue,
            {
                module: 'Admins',
                action: 'Toggle Admin Status',
                description: `Change account status to ${req.body.status} of admin @ ${updatedUser.email}`,
                userId: req.user!.id,
                activityTimestamp: new Date(),
            }
        );
        req.flash('message:toast', 'User status updated successfully');
        return res.redirect('back');
    }
}
