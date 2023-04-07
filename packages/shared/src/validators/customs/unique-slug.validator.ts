import { RoleEntity } from 'shared/entities';
import { AbstractUniqueValidator } from '../abstracts';
import { Repository } from 'typeorm';
import { GetRepository } from 'core/entities';

export class UniqueSlugValidator extends AbstractUniqueValidator<RoleEntity> {
    @GetRepository(RoleEntity)
    protected repository: Repository<RoleEntity>;

    constructor() {
        super(['slug']);
    }
}
