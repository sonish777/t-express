import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class addCmsConfigurationsTable1678759009641
    implements MigrationInterface
{
    tableName = 'cms_configs';
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: this.tableName,
                columns: [
                    new TableColumn({
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    }),
                    new TableColumn({
                        name: '_id',
                        type: 'uuid',
                        isUnique: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    }),
                    new TableColumn({
                        name: 'name',
                        type: 'varchar',
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: 'slug',
                        type: 'varchar',
                        isNullable: false,
                        isUnique: true,
                    }),
                    new TableColumn({
                        name: 'value',
                        type: 'varchar',
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: 'type',
                        type: 'varchar',
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    }),
                    new TableColumn({
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                    }),
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.tableName);
    }
}
