import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from 'typeorm';

export class addAdminActivityLogsTable1677998729816
    implements MigrationInterface
{
    tableName = 'adminActivityLogs';

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
                        name: 'module',
                        type: 'varchar',
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: 'action',
                        type: 'varchar',
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    }),
                    new TableColumn({
                        name: 'userId',
                        type: 'integer',
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: 'activityTimestamp',
                        type: 'timestamp',
                        default: 'now()',
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

        await queryRunner.createForeignKey(
            this.tableName,
            new TableForeignKey({
                columnNames: ['userId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.tableName);
    }
}
