import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { GetRepository } from 'core/entities';
import { BaseService } from 'core/services';
import { UserEntity } from 'shared/entities';
import { RoleService } from './role.service';
import { CreateUserDto, UpdateUserDto } from '@cms/dtos';
import { BadRequestException } from 'shared/exceptions';
import { DTO, Sanitize } from 'core/utils';

@Service()
export class UserService extends BaseService<UserEntity> {
    @GetRepository(UserEntity)
    protected readonly repository: Repository<UserEntity>;
    protected readonly filterColumns = ['firstName', 'lastName'];

    constructor(private readonly roleService: RoleService) {
        super();
    }

    getRolesForDropdown() {
        return this.roleService.findAll();
    }

    @Sanitize
    async createUser(@DTO createUserDto: CreateUserDto) {
        const { roleId, ...rest } = createUserDto;
        const roleEntity = await this.roleService.findOne({
            _id: roleId,
        });
        if (!roleEntity) {
            throw new BadRequestException('Invalid role');
        }
        return this.create({
            ...rest,
            role: [roleEntity],
        });
    }

    @Sanitize
    async updateUser(
        id: number,
        @DTO payload: UpdateUserDto
    ): Promise<UserEntity> {
        const role = await this.roleService.findOne({
            _id: payload.roleId,
        });
        if (!role) {
            throw new BadRequestException('Invalid role');
        }
        return this.update(id, { ...payload, role: [role] });
    }
}
