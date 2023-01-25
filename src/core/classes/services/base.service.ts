import { Repository } from "typeorm";
import { BaseEntity } from "../entities/base.entity";

export class BaseService<K extends BaseEntity> {
    repository: Repository<K>;

    findAll(): Promise<K[]> {
        return this.repository.find();
    }
}
