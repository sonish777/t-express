import { Repository } from 'typeorm';
import { GetRepository } from 'core/entities';
import { ApiUserEntity, UserEntity } from 'shared/entities';
import { AbstractUniqueValidator } from '../abstracts';

export class UniqueUserEmailValidator extends AbstractUniqueValidator<UserEntity> {
    @GetRepository(UserEntity)
    protected readonly repository: Repository<UserEntity>;

    constructor() {
        super(['email', 'mobileNumber']);
    }
}

export class UniqueApiUserEmailValidator extends AbstractUniqueValidator<ApiUserEntity> {
    @GetRepository(ApiUserEntity)
    protected readonly repository: Repository<ApiUserEntity>;

    constructor() {
        super(['email', 'mobileNumber']);
    }
}
