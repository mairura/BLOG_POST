import { MigrationInterface, QueryRunner } from "typeorm";

export class SetdefaultValueForBody1753695565917 implements MigrationInterface {
    name = 'SetdefaultValueForBody1753695565917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "body" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "body" DROP DEFAULT`);
    }

}
