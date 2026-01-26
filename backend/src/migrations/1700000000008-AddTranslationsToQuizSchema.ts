import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTranslationsToQuizSchema1700000000008 implements MigrationInterface {
    name = 'AddTranslationsToQuizSchema1700000000008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add translations column to quiz_schema table
        await queryRunner.query(`
            ALTER TABLE "quiz_schema" 
            ADD COLUMN "translations" jsonb
        `);

        // Add comment explaining the structure
        await queryRunner.query(`
            COMMENT ON COLUMN "quiz_schema"."translations" IS 
            'Multilingual translations: {"question_text": {"en": "English", "hi": "Hindi"}, "options": {"en": [...], "hi": [...]}}'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "quiz_schema" 
            DROP COLUMN "translations"
        `);
    }
}

