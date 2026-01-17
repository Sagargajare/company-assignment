import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableCheck,
} from 'typeorm';

export class CreateSlotsTable1700000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'slots',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'coach_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'start_time',
            type: 'timestamptz',
            isNullable: false,
          },
          {
            name: 'end_time',
            type: 'timestamptz',
            isNullable: false,
          },
          {
            name: 'timezone',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'available'",
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

    // Add check constraint for end_time > start_time
    await queryRunner.createCheckConstraint(
      'slots',
      new TableCheck({
        name: 'CHK_slots_end_time_after_start_time',
        expression: 'end_time > start_time',
      })
    );

    // Add foreign key
    await queryRunner.createForeignKey(
      'slots',
      new TableForeignKey({
        columnNames: ['coach_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'coaches',
        onDelete: 'CASCADE',
      })
    );

    // Add indexes
    await queryRunner.createIndex(
      'slots',
      new TableIndex({
        name: 'idx_slots_coach_id',
        columnNames: ['coach_id'],
      })
    );

    await queryRunner.createIndex(
      'slots',
      new TableIndex({
        name: 'idx_slots_status',
        columnNames: ['status'],
      })
    );

    await queryRunner.createIndex(
      'slots',
      new TableIndex({
        name: 'idx_slots_time_range',
        columnNames: ['start_time', 'end_time'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('slots');
  }
}

