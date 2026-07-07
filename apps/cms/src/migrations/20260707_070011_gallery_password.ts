import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "gallery_passwords" ALTER COLUMN "hash" DROP NOT NULL;
  ALTER TABLE "gallery_passwords" ADD COLUMN "password" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "gallery_passwords" ALTER COLUMN "hash" SET NOT NULL;
  ALTER TABLE "gallery_passwords" DROP COLUMN "password";`)
}
