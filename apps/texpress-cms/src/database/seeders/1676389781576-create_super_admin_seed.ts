import { MigrationInterface, QueryRunner } from 'typeorm';
import { UserEntity } from 'shared/entities';

export class createSuperAdminSeed1676389781576 implements MigrationInterface {
    superAdmin: Partial<UserEntity> = {
        email: 'admin@texpress.com',
        password: 'Test@1234',
        firstName: 'superadmin',
        status: 'active',
    };

    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepository = queryRunner.manager.getRepository(UserEntity);
        const user = await userRepository.findOne({
            where: { email: this.superAdmin.email },
        });
        if (user) {
            return Promise.resolve();
        }
        const newUser = userRepository.create({ ...this.superAdmin });
        await userRepository.save(newUser);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.manager.getRepository(UserEntity).delete({
            email: this.superAdmin.email,
        });
    }
}
