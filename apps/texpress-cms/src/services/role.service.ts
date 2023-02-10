import { GetRepository } from 'core/entities';
import { HttpException } from 'core/exceptions';
import { BaseService } from 'core/services';
import { RoleEntity } from 'shared/entities';
import { CreateRole } from 'shared/dtos';
import { Inject, Service } from 'typedi';
import { DeepPartial, Repository } from 'typeorm';
import { PermissionService } from './permission.service';

@Service()
export class RoleService extends BaseService<RoleEntity> {
    @GetRepository(RoleEntity)
    protected readonly repository: Repository<RoleEntity>;

    constructor(
        @Inject() private readonly permissionService: PermissionService
    ) {
        super();
    }

    async createRoleWithPermissions(payload: CreateRole) {
        const { name, slug, permissions } = payload;
        const role = await this.create({ name, slug });
        const rolePermissions = await this.permissionService.getPermissionInIds(
            permissions.map((p) => Number(p))
        );
        role.permissions = rolePermissions;
        return this.repository.save(role);
    }

    getModulePermissions() {
        return this.permissionService.getModulePermissions();
    }

    async update(
        id: number,
        payload: DeepPartial<RoleEntity>
    ): Promise<RoleEntity> {
        const entity = await this.repository.findOne({
            where: {
                id,
            },
        });
        if (!entity) {
            throw new HttpException(
                400,
                'Role not found',
                'NotFoundException',
                true
            );
        }
        if (!payload.permissions) {
            payload.permissions = [];
        }
        if (!Array.isArray(payload.permissions)) {
            payload.permissions = [payload.permissions];
        }
        const rolePermissions = await this.permissionService.getPermissionInIds(
            payload.permissions.map((p) => Number(p))
        );
        return this.repository.save({
            ...entity,
            ...payload,
            permissions: rolePermissions,
        });
    }
}
