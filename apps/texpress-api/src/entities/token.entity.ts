import { BaseEntity, SetRepository } from 'core/entities';
import { postgresDataSource } from 'shared/connections';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'tokens' })
@SetRepository(postgresDataSource)
export class TokenEntity extends BaseEntity {
    @Column()
    _id: string;

    @Column()
    userId: number;

    @Column()
    isRevoked: boolean;
}
