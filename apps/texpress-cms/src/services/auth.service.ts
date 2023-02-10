import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { GetRepository } from 'core/entities';
import { BaseService } from 'core/services';
import { UserEntity } from 'shared/entities';
@Service()
export class AuthService extends BaseService<UserEntity> {
    @GetRepository(UserEntity)
    readonly repository: Repository<UserEntity>;

    async findUserForLogin(username: string) {
        return this.repository.findOne({
            where: [{ email: username }, { mobileNumber: username }],
        });
    }
}
