import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class createRolePermissionTable1675528670428
  implements MigrationInterface
{
  tableName = 'role_permissions';
  foreignKeys = [
    {
      column: 'roleId',
      referencedColumn: 'id',
      referencedTable: 'roles',
    },
    {
      column: 'permissionId',
      referencedColumn: 'id',
      referencedTable: 'permissions',
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
            name: 'permissionId',
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
