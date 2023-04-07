import { CMSModulesConfig } from '@cms/configs';
import { PermissionEntity, RoleEntity } from 'shared/entities';
import { DeepPartial, MigrationInterface, QueryRunner } from 'typeorm';

export class syncPermissionSeed1676389815647 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const permissionsRepository =
            queryRunner.manager.getRepository(PermissionEntity);
        const roleRepository = queryRunner.manager.getRepository(RoleEntity);
        const permissions: DeepPartial<PermissionEntity>[] = [];
        for (const module of Object.values(CMSModulesConfig)) {
            for (const permission of module.permissions ?? []) {
                const permissionExists = await permissionsRepository.findOne({
                    where: {
                        module: module.name,
                        method: permission.method,
                        action: permission.value,
                        route: permission.route,
                    },
                });
                if (!permissionExists) {
                    permissions.push({
                        module: module.name,
                        name: permission.name,
                        method: permission.method,
                        action: permission.value,
                        route: permission.route,
                    });
                }
            }
        }
        const syncedPermissions = await permissionsRepository.save(permissions);
        const superAdminRole = await roleRepository.findOne({
            where: { slug: 'super-admin' },
            relations: ['permissions'],
        });
        if (!superAdminRole) {
            return;
        }
        superAdminRole.permissions = [
            ...(superAdminRole.permissions || []),
            ...syncedPermissions,
        ];
        await roleRepository.save(superAdminRole);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.getRepository(PermissionEntity).delete({});
    }
}
