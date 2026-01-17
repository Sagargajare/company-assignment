import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOptionsToQuizSchema1700000000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "quiz_schema" 
      ADD COLUMN "options" jsonb NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "quiz_schema" 
      DROP COLUMN "options"
    `);
  }
}

