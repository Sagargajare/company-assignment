import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateCoachesTable1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'coaches',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'specialization',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'seniority_level',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'languages',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'timezone',
            type: 'varchar',
            length: '50',
            default: "'Asia/Kolkata'",
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    await queryRunner.createIndex(
      'coaches',
      new TableIndex({
        name: 'idx_coaches_seniority',
        columnNames: ['seniority_level'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('coaches');
  }
}

