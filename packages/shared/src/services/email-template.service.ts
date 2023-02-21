import { GetRepository } from 'core/entities';
import { BaseService } from 'core/services';
import { EmailTemplateEntity } from 'shared/entities';
import { Service } from 'typedi';
import { Repository } from 'typeorm';

@Service()
export class EmailTemplateService extends BaseService<EmailTemplateEntity> {
    @GetRepository(EmailTemplateEntity)
    protected repository: Repository<EmailTemplateEntity>;

    findTemplateByCode(code: string) {
        return this.findOrFail({
            code,
        });
    }
}
