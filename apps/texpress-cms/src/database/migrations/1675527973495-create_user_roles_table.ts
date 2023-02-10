import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from 'typeorm';

export class createUserRolesTable1675527973495 implements MigrationInterface {
    tableName = 'user_roles';
    foreignKeys = [
        {
            column: 'roleId',
            referencedTable: 'roles',
            referencedColumn: 'id',
        },
        {
            column: 'userId',
            referencedTable: 'users',
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
                        name: 'roleId',
                        type: 'integer',
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: 'userId',
                        type: 'integer',
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

        for (const fKey of this.foreignKeys) {
            await queryRunner.createForeignKey(
                this.tableName,
                new TableForeignKey({
                    columnNames: [fKey.column],
                    referencedColumnNames: [fKey.referencedColumn],
                    referencedTableName: fKey.referencedTable,
                    onDelete: 'CASCADE',
                })
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.tableName);
    }
}
