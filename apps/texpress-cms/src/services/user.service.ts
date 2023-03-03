import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { GetRepository } from 'core/entities';
import { BaseService } from 'core/services';
import { UserEntity } from 'shared/entities';
import { RoleService } from './role.service';
import { CreateUserDto, UpdateUserDto } from '@cms/dtos';
import { BadRequestException } from 'shared/exceptions';
import { DTO, Sanitize } from 'core/utils';
import { AuthEventsEmitter } from 'shared/events';
import { generateToken } from 'shared/utils';
import { ServerConfig } from '@cms/configs';

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
    @AuthEventsEmitter(
        'cms-forgot-password',
        (user: UserEntity & { resetPasswordUrl?: string }) =>
            user.resetPasswordUrl
                ? [
                      {
                          to_email: user.email,
                          reset_password_link: user.resetPasswordUrl,
                          user_name: `${user.firstName ?? ''} ${
                              user.lastName ?? ''
                          }`,
                      },
                  ]
                : false
    )
    async createUser(@DTO createUserDto: CreateUserDto) {
        const { roleId, sendActivationLink, ...rest } = createUserDto;
        const roleEntity = await this.roleService.findOne({
            _id: roleId,
        });
        if (!roleEntity) {
            throw new BadRequestException('Invalid role');
        }
        if (sendActivationLink !== 'on') {
            return this.create({
                ...rest,
                role: [roleEntity],
            });
        }
        const token = generateToken();
        const tokenExpiry = new Date(Date.now() + 600000);
        const user = await this.create({
            ...rest,
            role: [roleEntity],
            token,
            tokenExpiry,
        });
        return {
            ...user,
            resetPasswordUrl: `${ServerConfig.URL}/auth/reset-password?token=${token}`,
        };
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
