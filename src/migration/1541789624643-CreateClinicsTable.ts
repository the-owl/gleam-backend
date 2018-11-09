import { MigrationInterface, QueryRunner } from 'typeorm';


export class CreateClinicsTable1541789624643 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TABLE "clinic" (
        "id" SERIAL NOT NULL,
        "name" text NOT NULL,
        "type" text NOT NULL,
        "address" text NOT NULL,
        "rating" numeric(2, 1) NOT NULL,
        "lat" float NOT NULL,
        "lon" float NOT NULL,
        "schedule" json NOT NULL,
        CONSTRAINT "PK_8e97c18debc9c7f7606e311d763" PRIMARY KEY ("id")
      )
    `);
  }

  public async down (queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "clinic"`);
  }
}
