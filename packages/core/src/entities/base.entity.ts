import { Exclude } from 'class-transformer';
import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
    @PrimaryGeneratedColumn()
    @Exclude({ toPlainOnly: true })
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
