import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { GetRepository } from '@core/entities';
import { BaseService } from '@core/services';
import { UserEntity } from '@entities';

@Service()
export class UserService extends BaseService<UserEntity> {
  @GetRepository(UserEntity)
  repository: Repository<UserEntity>;

  findAll(): Promise<UserEntity[]> {
    return this.repository.find();
  }
}
