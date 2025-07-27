import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedCreatedTimeStamp1753616256208 implements MigrationInterface {
  name = 'AddedCreatedTimeStamp1753616256208';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tags" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "createdAt"`);
  }
}
