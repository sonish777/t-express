import { GetRepository } from 'core/entities';
import { BaseService } from 'core/services';
import { EmailTemplateEntity } from 'shared/entities';
import { Service } from 'typedi';
import { Repository } from 'typeorm';

@Service()
export class EmailTemplateService extends BaseService<EmailTemplateEntity> {
    @GetRepository(EmailTemplateEntity)
    protected repository: Repository<EmailTemplateEntity>;

    protected readonly filterColumns: string[] = ['subject', 'code'];

    findTemplateByCode(code: string) {
        return this.findOrFail({
            code,
        });
    }
}
