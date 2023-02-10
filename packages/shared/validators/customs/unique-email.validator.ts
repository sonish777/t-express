import { Repository } from 'typeorm';
import { GetRepository } from 'core/entities';
import { CustomValidator } from 'core/validators';
import { UserEntity } from 'shared/entities';
import { Meta } from 'express-validator';
import { HTTPMethods } from 'core/utils';

export class UniqueEmailValidator implements CustomValidator {
  @GetRepository(UserEntity)
  private readonly usersRepository: Repository<UserEntity>;

  async validate(value: string, { req }: Meta) {
    const user = await this.usersRepository.findOne({
      where: { email: value },
    });
    if (!user) {
      return true;
    }
    if (
      req.method?.toLowerCase() !== HTTPMethods.Post &&
      user.id === Number(req.params?.id)
    ) {
      return true;
    }
    throw 'User with this email already exists';
  }
}
