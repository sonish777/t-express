import { MigrationInterface, QueryRunner } from 'typeorm';
import { RoleEntity, UserEntity } from 'shared/entities';

export class createRolesSeed1676389796875 implements MigrationInterface {
    superAdminRole = {
        name: 'Super Admin',
        slug: 'super-admin',
    };

    public async up(queryRunner: QueryRunner): Promise<void> {
        const rolesRepository = queryRunner.manager.getRepository(RoleEntity);
        const userRepository = queryRunner.manager.getRepository(UserEntity);
        const roleExists = await rolesRepository.findOne({
            where: { slug: this.superAdminRole.slug },
        });
        const superAdmin = await userRepository.findOne({
            where: { email: 'admin@texpress.com' },
        });
        if (roleExists) {
            if (superAdmin) {
                superAdmin.role = [roleExists];
                await userRepository.save(superAdmin);
            }
            return;
        }
        const role = await rolesRepository.save(this.superAdminRole);
        if (superAdmin) {
            superAdmin.role = [role];
            await userRepository.save(superAdmin);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.getRepository(RoleEntity).delete({
            slug: this.superAdminRole.slug,
        });
    }
}
