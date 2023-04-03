import _ from 'lodash';
import { BaseEntity } from 'core/entities';
import { Breadcrumb, CommonSearchQuery } from 'core/interfaces';
import { BaseService } from 'core/services';
import { HTTPMethods } from 'core/utils';
import { Validator } from 'core/validators';
import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { ProtectedRoute } from './decorators';
import { TypedQuery } from './interfaces/typed-query.interface';
import { TypedBody } from './interfaces';
import { CatchAsync } from 'core/exceptions';
import { Publisher } from 'rabbitmq';
import { AdminActivityLogEntity } from 'shared/entities';
import { QueueConfig } from 'shared/configs';

export function ResourceControllerFactory<
    Model extends BaseEntity,
    Service extends BaseService<Model>
>(options: {
    resource: string;
    findRelations?: string[];
    validators?: {
        create?: Validator[];
        update?: Validator[];
    };
}) {
    abstract class ResourceController extends BaseController {
        public readonly _baseView: string = 'base';
        public page = 'index';
        public readonly _module: string = options.resource;
        public abstract _title: string;
        public abstract _viewPath: string;
        public indexBreadcrumbs: Breadcrumb[] = [
            { name: _.capitalize(this._module), url: `/${this._module}` },
        ];
        public breadcrumbs: Breadcrumb[] = [];

        constructor(
            public readonly service: Service,
            public readonly publisher: Publisher
        ) {
            super();
        }

        @ProtectedRoute({
            method: HTTPMethods.Get,
            path: '/',
        })
        @CatchAsync
        async index(req: TypedQuery<CommonSearchQuery>, res: Response) {
            this.page = 'index';
            this.setBreadcrumbs(this.indexBreadcrumbs);
            const data = await this.service.paginate(
                {
                    ...req.query,
                },
                options.findRelations
            );
            if (req.query.keywords) {
                req.flash('inputData', req.query.keywords);
            }
            return this.render(res, data);
        }

        @ProtectedRoute({
            method: HTTPMethods.Get,
            path: '/create',
        })
        @CatchAsync
        create(_req: Request, res: Response) {
            this.page = 'create';
            this.setBreadcrumbs([
                ...this.indexBreadcrumbs,
                { name: 'Create', url: '#' },
            ]);
            return this.render(res);
        }

        @ProtectedRoute({
            method: HTTPMethods.Post,
            path: '/',
            validators: [...(options.validators?.create ?? [])],
        })
        @CatchAsync
        async add(req: Request, res: Response) {
            await this.service.create(req.body);
            this.publisher.publish<Partial<AdminActivityLogEntity>>(
                QueueConfig.Cms.Exchange,
                QueueConfig.Cms.ActivityLogQueue,
                {
                    module: _.capitalize(this._module),
                    action: 'Create',
                    description: `Created a new ${this._module}`,
                    userId: (req.user as NonNullable<typeof req.user>).id,
                    activityTimestamp: new Date(),
                }
            );
            req.flash(
                'message:toast',
                `${_.capitalize(options.resource)} created successfully`
            );
            return res.redirect('back');
        }

        @ProtectedRoute({
            method: HTTPMethods.Get,
            path: '/:id',
        })
        @CatchAsync
        async edit(req: Request, res: Response) {
            const id = req.params.id;
            this.page = 'edit';
            this.setBreadcrumbs([
                ...this.indexBreadcrumbs,
                { name: 'Edit', url: '#' },
            ]);
            const data = await this.service.findOne({ id: <any>Number(id) });
            if (!data) {
                req.flash(
                    'error',
                    `${_.capitalize(options.resource)} not found`
                );
                return res.redirect('back');
            }
            return this.render(res, data);
        }

        @ProtectedRoute({
            method: HTTPMethods.Put,
            path: '/:id',
            validators: [...(options.validators?.update ?? [])],
        })
        @CatchAsync
        async update(req: TypedBody<any>, res: Response) {
            const body = req.body;
            const id = req.params.id;
            const updated = await this.service.update(Number(id), body);
            this.publisher.publish<Partial<AdminActivityLogEntity>>(
                QueueConfig.Cms.Exchange,
                QueueConfig.Cms.ActivityLogQueue,
                {
                    module: _.capitalize(this._module),
                    action: 'Update',
                    description: `Updated the details of ${this._module} @id:${updated.id}`,
                    userId: (req.user as NonNullable<typeof req.user>).id,
                    activityTimestamp: new Date(),
                }
            );
            req.flash(
                'message:toast',
                `${_.capitalize(options.resource)} updated successfully`
            );
            return res.redirect('back');
        }

        @ProtectedRoute({
            method: HTTPMethods.Delete,
            path: '/:id',
        })
        @CatchAsync
        async delete(req: Request, res: Response) {
            const id = req.params.id;
            await this.service.delete(Number(id));
            this.publisher.publish<Partial<AdminActivityLogEntity>>(
                QueueConfig.Cms.Exchange,
                QueueConfig.Cms.ActivityLogQueue,
                {
                    module: _.capitalize(this._module),
                    action: 'Delete',
                    description: `Deleted a ${this._module} @id:${id}`,
                    userId: (req.user as NonNullable<typeof req.user>).id,
                    activityTimestamp: new Date(),
                }
            );
            req.flash(
                'message:toast',
                `${_.capitalize(options.resource)} deleted successfully`
            );
            return res.redirect('back');
        }
    }

    return ResourceController;
}
