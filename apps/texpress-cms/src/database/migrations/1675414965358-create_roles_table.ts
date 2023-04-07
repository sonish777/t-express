import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class createRolesTable1675414965358 implements MigrationInterface {
    tableName = 'roles';
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
                        isUnique: true,
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
