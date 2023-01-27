import { BaseService } from "@core/classes/services/base.service";
import { GetRepository } from "@core/decorators";
import { UserEntity } from "@entities/user.entity";
import { Service } from "typedi";
import { Repository } from "typeorm";


@Service()
export class AuthService extends BaseService<UserEntity> {
    @GetRepository(UserEntity)
    readonly repository: Repository<UserEntity>;

    async findUserForLogin(username: string) {
        return this.repository.findOne({
            where: [{ email: username }, { mobileNumber: username }]
        });
    }
}