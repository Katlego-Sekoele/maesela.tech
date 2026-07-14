import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "portrait_id" varchar;
  ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "portrait_alt" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about" DROP COLUMN IF EXISTS "portrait_id";
  ALTER TABLE "about" DROP COLUMN IF EXISTS "portrait_alt";`)
}
