import { postgresDataSource } from '../connections';
import { BaseEntity, SetRepository } from 'core/entities';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'permissions' })
@SetRepository(postgresDataSource)
export class PermissionEntity extends BaseEntity {
    @Column({ type: 'uuid', default: () => 'uuid_generate_v4()' })
    _id: string;

    @Column()
    name: string;

    @Column()
    route: string;

    @Column()
    method: string;

    @Column()
    action: string;

    @Column()
    module: string;
}
