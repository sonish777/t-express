import { Service } from "typedi";
import { Repository } from "typeorm";
import { BaseService } from "../core/classes/services/base.service";
import { GetRepository } from "../core/decorators";
import { UserEntity } from "../entities/user.entity";

@Service()
export class UserService extends BaseService<UserEntity> {
    @GetRepository(UserEntity)
    repository: Repository<UserEntity>;

    findAll(): Promise<UserEntity[]> {
        return this.repository.find();
    }
}