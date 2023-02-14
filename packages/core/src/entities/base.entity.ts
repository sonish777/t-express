import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({
        default: `now()`,
    })
    createdAt: Date;

    @UpdateDateColumn({
        default: `now()`,
        onUpdate: 'now()',
    })
    updatedAt: Date;
}
