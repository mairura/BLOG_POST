import { MigrationInterface, QueryRunner } from "typeorm";

export class SetdefaultValueForTitle1753695617425 implements MigrationInterface {
    name = 'SetdefaultValueForTitle1753695617425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "body" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "title" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "title" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "body" DROP DEFAULT`);
    }

}
