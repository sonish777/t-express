import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { GetRepository } from 'core/entities';
import { BaseService } from 'core/services';
import { AdminActivityLogEntity, UserEntity } from 'shared/entities';
import { RoleService } from './role.service';
import { CreateUserDto, ResetPasswordDto, UpdateUserDto } from '@cms/dtos';
import { BadRequestException } from 'shared/exceptions';
import { DTO, Sanitize } from 'core/utils';
import { AuthEventsEmitter } from 'shared/events';
import { extractMulterFileNames, generateToken } from 'shared/utils';
import { ServerConfig } from '@cms/configs';
import { Publisher } from 'rabbitmq';
import { QueueConfig } from 'shared/configs';
import { ActivityLogEventEmitter } from '@cms/events';

@Service()
export class UserService extends BaseService<UserEntity> {
    @GetRepository(UserEntity)
    protected readonly repository: Repository<UserEntity>;
    protected readonly filterColumns = ['firstName', 'lastName'];

    constructor(
        private readonly roleService: RoleService,
        private readonly publisher: Publisher
    ) {
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
    @ActivityLogEventEmitter(
        'log-event',
        (returnedValue: UserEntity & { eventData: AdminActivityLogEntity }) => [
            returnedValue.eventData,
        ]
    )
    async createUser(
        @DTO createUserDto: CreateUserDto,
        uploadedFiles:
            | Record<string, Express.Multer.File[]>
            | Express.Multer.File[] = {},
        loggedInUserId: number
    ) {
        const uploads = extractMulterFileNames<UserEntity>(
            ['avatar'],
            uploadedFiles
        );
        const { roleId, sendActivationLink, ...rest } = createUserDto;
        const roleEntity = await this.roleService.findOne({
            _id: roleId,
        });
        if (!roleEntity) {
            throw new BadRequestException('Invalid role');
        }
        const createUserPayload: Partial<UserEntity> = {
            ...rest,
            role: [roleEntity],
            ...uploads,
        };
        if (sendActivationLink === 'on') {
            const token = generateToken();
            const tokenExpiry = new Date(Date.now() + 600000);
            createUserPayload.token = token;
            createUserPayload.tokenExpiry = tokenExpiry;
        }
        const user = await this.create(createUserPayload);
        if (Object.keys(uploads).length > 0) {
            this.publisher.publish(
                QueueConfig.Cms.Exchange,
                QueueConfig.Shared.GenerateThumbnailQueue,
                {
                    uploadedFiles,
                    uploadThumbnailMap: [['avatar', 'thumbnail']],
                    module: 'admins',
                }
            );
        }
        return {
            ...user,
            resetPasswordUrl: user.token
                ? `${ServerConfig.URL}/auth/reset-password?token=${user.token}`
                : null,
            eventData: {
                module: 'Admins',
                action: 'Create',
                description: 'Created a new admin user',
                userId: loggedInUserId,
                activityTimestamp: new Date(),
            },
        };
    }

    @Sanitize
    @ActivityLogEventEmitter(
        'log-event',
        (returnedValue: UserEntity & { eventData: AdminActivityLogEntity }) => [
            returnedValue.eventData,
        ]
    )
    async changePassword(
        _id: string,
        @DTO changePasswordDto: ResetPasswordDto,
        loggedInUserId: number
    ) {
        const user = await this.findOrFail({
            _id,
        });
        user.password = changePasswordDto.password;
        await this.repository.save(user);
        return {
            ...user,
            eventData: {
                module: 'Admins',
                action: 'Change Password',
                description: `Changed the password of admin @ ${user.email}`,
                userId: loggedInUserId,
                activityTimestamp: new Date(),
            },
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
