import { MigrationInterface, QueryRunner } from "typeorm";

export class SetdefaultValueForDesc1753695461009 implements MigrationInterface {
    name = 'SetdefaultValueForDesc1753695461009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "description" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "description" DROP DEFAULT`);
    }

}
