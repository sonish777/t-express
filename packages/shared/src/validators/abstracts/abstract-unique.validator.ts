import { BaseEntity } from 'core/entities';
import { HTTPMethods } from 'core/utils';
import { CustomValidator } from 'core/validators';
import { Meta } from 'express-validator';
import { FindOptionsWhere, Repository } from 'typeorm';

export abstract class AbstractUniqueValidator<K extends BaseEntity>
    implements CustomValidator
{
    protected abstract repository: Repository<K>;
    constructor(private readonly uniqueColumns: (keyof K)[]) {}

    async validate(value: any, { req, path }: Meta) {
        const whereConditions: FindOptionsWhere<K>[] = this.uniqueColumns.map(
            (col) =>
                <FindOptionsWhere<K>>{
                    [col]: value,
                }
        );
        const exists = await this.repository.findOne({
            where: whereConditions,
        });
        if (!exists) {
            return true;
        }
        if (
            req.method?.toLowerCase() !== HTTPMethods.Post &&
            exists.id === Number(req.params?.id)
        ) {
            return true;
        }
        throw `${path} already taken`;
    }
}
