import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from 'typeorm';

export class CreateQuizResponsesTable1700000000005
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'quiz_responses',
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
            name: 'question_id',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'answer',
            type: 'jsonb',
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

    // Add unique constraint
    await queryRunner.createUniqueConstraint(
      'quiz_responses',
      new TableUnique({
        name: 'UQ_quiz_responses_user_question',
        columnNames: ['user_id', 'question_id'],
      })
    );

    // Add foreign key to users
    await queryRunner.createForeignKey(
      'quiz_responses',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    // Add indexes
    await queryRunner.createIndex(
      'quiz_responses',
      new TableIndex({
        name: 'idx_quiz_responses_user_id',
        columnNames: ['user_id'],
      })
    );

    await queryRunner.createIndex(
      'quiz_responses',
      new TableIndex({
        name: 'idx_quiz_responses_question_id',
        columnNames: ['question_id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('quiz_responses');
  }
}

