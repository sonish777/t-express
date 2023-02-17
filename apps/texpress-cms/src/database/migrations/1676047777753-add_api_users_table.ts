import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class addApiUsersTable1676047777753 implements MigrationInterface {
    tableName = 'api_users';
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: this.tableName,
                columns: [
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: '_id',
                        type: 'uuid',
                        isGenerated: true,
                        isUnique: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'firstName',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'lastName',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'gender',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'dob',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'mobileNumber',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'salt',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        default: `'inactive'`,
                    },
                    {
                        name: 'token',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'tokenExpiry',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.tableName);
    }
}
