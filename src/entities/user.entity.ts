import { Column, Entity } from "typeorm";
import { BaseEntity } from "../core/classes/entities/base.entity";
import { SetRepository } from "../core/decorators";

@Entity({
    name: "users"
})
@SetRepository()
export class UserEntity extends BaseEntity {
    @Column()
    _id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    dob: Date;

    @Column()
    gender: string;

    @Column()
    mobileNumber: string;

    @Column()
    email: string;

    @Column()
    status: string;
}
