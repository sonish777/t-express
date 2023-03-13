import { Controller, ResourceControllerFactory } from 'core/controllers';
import { Publisher } from 'rabbitmq';
import { EmailTemplateService } from 'shared/services';

@Controller('/email-templates')
export class EmailTemplateController extends ResourceControllerFactory({
    resource: 'email-templates',
}) {
    public _title = 'Email Templates';
    public _viewPath = 'email-templates';

    constructor(
        public readonly service: EmailTemplateService,
        public readonly publisher: Publisher
    ) {
        super(service, publisher);
    }
}
