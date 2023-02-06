import { GetRepository } from '@core/entities';
import { BaseService } from '@core/services';
import { RoleEntity } from '@entities';
import { Service } from 'typedi';
import { Repository } from 'typeorm';

@Service()
export class RoleService extends BaseService<RoleEntity> {
  @GetRepository(RoleEntity)
  protected readonly repository: Repository<RoleEntity>;
}
