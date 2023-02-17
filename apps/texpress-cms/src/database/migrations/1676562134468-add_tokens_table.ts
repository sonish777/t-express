import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from 'typeorm';

export class addTokensTable1676562134468 implements MigrationInterface {
    tableName = 'tokens';
    foreignKeys = [
        {
            column: 'userId',
            referencedTable: 'api_users',
            referencedColumn: 'id',
        },
    ];
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
                        name: 'userId',
                        type: 'integer',
                        isNullable: true,
                    }),
                    new TableColumn({
                        name: 'isRevoked',
                        type: 'boolean',
                        default: false,
                    }),
                    new TableColumn({
                        name: 'createdAt',
                        type: 'timestamp',
                        default: `now()`,
                    }),
                    new TableColumn({
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: `now()`,
                    }),
                ],
            })
        );
        for (const key of this.foreignKeys) {
            await queryRunner.createForeignKey(
                this.tableName,
                new TableForeignKey({
                    columnNames: [key.column],
                    referencedColumnNames: [key.referencedColumn],
                    referencedTableName: key.referencedTable,
                })
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.tableName);
    }
}
