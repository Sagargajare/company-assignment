import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableUnique,
  TableCheck,
} from 'typeorm';

export class CreateBookingsTable1700000000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bookings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'slot_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'quiz_risk_score',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'confirmed'",
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

    // Add unique constraint on slot_id (CRITICAL for preventing double-booking)
    await queryRunner.createUniqueConstraint(
      'bookings',
      new TableUnique({
        name: 'UQ_bookings_slot_id',
        columnNames: ['slot_id'],
      })
    );

    // Add check constraint for risk score
    await queryRunner.createCheckConstraint(
      'bookings',
      new TableCheck({
        name: 'CHK_bookings_risk_score_range',
        expression: 'quiz_risk_score >= 0 AND quiz_risk_score <= 100',
      })
    );

    // Add foreign keys
    await queryRunner.createForeignKey(
      'bookings',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'bookings',
      new TableForeignKey({
        columnNames: ['slot_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'slots',
        onDelete: 'CASCADE',
      })
    );

    // Add indexes
    await queryRunner.createIndex(
      'bookings',
      new TableIndex({
        name: 'idx_bookings_user_id',
        columnNames: ['user_id'],
      })
    );

    await queryRunner.createIndex(
      'bookings',
      new TableIndex({
        name: 'idx_bookings_slot_id',
        columnNames: ['slot_id'],
        isUnique: true,
      })
    );

    await queryRunner.createIndex(
      'bookings',
      new TableIndex({
        name: 'idx_bookings_status',
        columnNames: ['status'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('bookings');
  }
}

