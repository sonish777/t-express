import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { GetRepository } from 'core/entities';
import { BaseService } from 'core/services';
import { ApiUserEntity } from 'shared/entities';

@Service()
export class ApiUserService extends BaseService<ApiUserEntity> {
    @GetRepository(ApiUserEntity)
    protected readonly repository: Repository<ApiUserEntity>;
    protected readonly filterColumns = ['firstName', 'lastName'];
}
