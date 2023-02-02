import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { GetRepository } from '@core/entities';
import { BaseService } from '@core/services';
import { UserEntity } from '@entities';
import { CreateUser } from '@controllers/web/interfaces/create-user.interface';

@Service()
export class UserService extends BaseService<UserEntity> {
  @GetRepository(UserEntity)
  protected readonly repository: Repository<UserEntity>;

  findAll(): Promise<UserEntity[]> {
    return this.repository.find();
  }

  create(userPayload: CreateUser): Promise<UserEntity> {
    const newUser = this.repository.create({ ...userPayload });
    return this.repository.save(newUser);
  }
}
