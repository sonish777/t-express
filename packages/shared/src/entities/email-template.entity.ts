import { BaseEntity, SetRepository } from 'core/entities';
import { postgresDataSource } from 'shared/connections';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'email_templates' })
@SetRepository(postgresDataSource)
export class EmailTemplateEntity extends BaseEntity {
    @Column()
    code: string;

    @Column()
    subject: string;

    @Column()
    content: string;
}
