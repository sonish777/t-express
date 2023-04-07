import { CMSConfigEntity } from '@cms/entities';
import { CMSConfigService } from '@cms/services';
import {
    CanAccess,
    Controller,
    ResourceControllerFactory,
    TypedBody,
} from 'core/controllers';
import { Breadcrumb } from 'core/interfaces';
import { Response } from 'express';
import path from 'path';
import { Publisher } from 'rabbitmq';
import { multerDiskStorage, MulterUpload } from 'shared/configs';

@Controller('/cms-configs')
@CanAccess
export class CMSConfigController extends ResourceControllerFactory<
    CMSConfigEntity,
    CMSConfigService
>({
    resource: 'cms-configs',
}) {
    _title = 'CMS Configurations';
    _viewPath = 'cms-configs';
    public indexBreadcrumbs: Breadcrumb[] = [
        { name: this._title, url: '/cms-configs' },
    ];

    constructor(
        public readonly service: CMSConfigService,
        public readonly publisher: Publisher
    ) {
        super(service, publisher);
    }

    @MulterUpload([{ name: 'value', maxCount: 1 }], {
        storage: multerDiskStorage(
            path.join(__dirname, '../../../public/uploads/logo')
        ),
    })
    async update(
        req: TypedBody<{ value: string }>,
        res: Response
    ): Promise<void> {
        const id = req.params.id;
        if (req.files && Object.keys(req.files).length > 0) {
            const uploadedFile = (
                req.files as Record<string, Express.Multer.File[]>
            )?.value[0];
            req.body.value = uploadedFile.filename;
        }
        await this.service.update(Number(id), { value: req.body.value });
        req.flash('message:toast', 'Configuration updated successfully');
        res.redirect('back');
    }
}
