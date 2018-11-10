import { MigrationInterface, QueryRunner } from 'typeorm';


export class CreateAppointmentsTable1541842926561 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      CREATE TABLE "appointment" (
        "id" SERIAL NOT NULL,
        "name" text NOT NULL,
        "phone" text NOT NULL,
        "email" text NOT NULL,
        "date" TIMESTAMP NOT NULL,
        "clinicId" integer,
        CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "appointment"
        ADD CONSTRAINT "FK_8fb4ae178c6bd844f42f69ae686"
        FOREIGN KEY ("clinicId") REFERENCES "clinic"("id")
    `);
  }

  public async down (queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "appointment"`);
  }
}
