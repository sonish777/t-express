import { Repository } from 'typeorm';
import { GetRepository } from '@core/entities';
import { CustomValidator } from '@core/validators';
import { UserEntity } from '@entities';

export class UniqueEmailValidator implements CustomValidator {
  @GetRepository(UserEntity)
  private readonly usersRepository: Repository<UserEntity>;

  async validate(value: string) {
    const user = await this.usersRepository.findOne({
      where: { email: value },
    });
    if (user) {
      throw 'User with this email already exists';
    }
    return true;
  }
}
