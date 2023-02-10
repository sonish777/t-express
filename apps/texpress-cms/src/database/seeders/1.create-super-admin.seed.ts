import { UserEntity } from 'shared/entities';
import { Seeder, Factory } from 'typeorm-seeding';
import { DataSource } from 'typeorm/data-source';

export class CreateSuperAdminSeeder implements Seeder {
    async run(factory: Factory, dataSource: DataSource) {
        const superAdmin: Partial<UserEntity> = {
            email: 'admin@texpress.com',
            password: 'Test@1234',
            firstName: 'superadmin',
            status: 'active',
        };
        const userRepository = dataSource.getRepository(UserEntity);
        const user = await userRepository.findOne({
            where: { email: superAdmin.email },
        });
        if (user) {
            return Promise.resolve();
        }
        const newUser = userRepository.create({ ...superAdmin });
        await userRepository.save(newUser);
        return;
    }
}
