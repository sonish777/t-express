import { CMSConfigEntity } from '@cms/entities';
import { GetRepository } from 'core/entities';
import { BaseService } from 'core/services';
import { Service } from 'typedi';
import { Repository } from 'typeorm';

@Service()
export class CMSConfigService extends BaseService<CMSConfigEntity> {
    @GetRepository(CMSConfigEntity)
    protected readonly repository: Repository<CMSConfigEntity>;
}
