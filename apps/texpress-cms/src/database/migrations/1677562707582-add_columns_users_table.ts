import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnsUsersTable1677562707582 implements MigrationInterface {
    tableName = 'users';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns(this.tableName, [
            new TableColumn({
                name: 'token',
                type: 'varchar',
                isNullable: true,
            }),
            new TableColumn({
                name: 'tokenExpiry',
                type: 'timestamp',
                isNullable: true,
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns(this.tableName, ['token', 'tokenExpiry']);
    }
}
