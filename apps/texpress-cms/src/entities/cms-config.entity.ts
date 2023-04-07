import { BaseEntity, SetRepository } from 'core/entities';
import { postgresDataSource } from 'shared/connections';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'cms_configs' })
@SetRepository(postgresDataSource)
export class CMSConfigEntity extends BaseEntity {
    @Column()
    _id: string;

    @Column()
    name: string;

    @Column()
    slug: string;

    @Column()
    value: string;

    @Column()
    type: string;
}
