import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateQuizSchemaTable1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'quiz_schema',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'question_id',
            type: 'varchar',
            length: '100',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'question_text',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'question_type',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'branching_rules',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'order_index',
            type: 'int',
            isNullable: false,
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
      'quiz_schema',
      new TableIndex({
        name: 'idx_quiz_schema_question_id',
        columnNames: ['question_id'],
        isUnique: true,
      })
    );

    await queryRunner.createIndex(
      'quiz_schema',
      new TableIndex({
        name: 'idx_quiz_schema_order',
        columnNames: ['order_index'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('quiz_schema');
  }
}

