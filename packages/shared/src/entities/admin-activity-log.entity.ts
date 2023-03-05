import { BaseEntity, SetRepository } from 'core/entities';
import { postgresDataSource } from 'shared/connections';
import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity({ name: 'adminActivityLogs' })
@SetRepository(postgresDataSource)
export class AdminActivityLogEntity extends BaseEntity {
    @Column({ type: 'uuid', default: () => 'uuid_generate_v4()' })
    _id: string;

    @Column()
    module: string;

    @Column()
    action: string;

    @Column()
    description: string;

    @Column()
    userId: number;

    @Column()
    activityTimestamp: Date;
}
