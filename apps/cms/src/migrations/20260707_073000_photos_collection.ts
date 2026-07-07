import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_media_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_media_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "media_id";
    DROP TABLE IF EXISTS "media" CASCADE;

    CREATE TABLE "photos" (
      "id" serial PRIMARY KEY NOT NULL,
      "pathname" varchar NOT NULL,
      "alt" varchar,
      "sensitive" boolean DEFAULT true,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX "photos_pathname_idx" ON "photos" USING btree ("pathname");
    CREATE INDEX "photos_sensitive_idx" ON "photos" USING btree ("sensitive");
    CREATE INDEX "photos_updated_at_idx" ON "photos" USING btree ("updated_at");
    CREATE INDEX "photos_created_at_idx" ON "photos" USING btree ("created_at");

    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "photos_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_photos_fk" FOREIGN KEY ("photos_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "payload_locked_documents_rels_photos_id_idx" ON "payload_locked_documents_rels" USING btree ("photos_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_photos_fk";
    DROP INDEX IF EXISTS "payload_locked_documents_rels_photos_id_idx";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "photos_id";
    DROP TABLE IF EXISTS "photos" CASCADE;

    CREATE TABLE "media" (
      "id" serial PRIMARY KEY NOT NULL,
      "alt" varchar NOT NULL,
      "sensitive" boolean DEFAULT false,
      "caption" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "url" varchar,
      "thumbnail_u_r_l" varchar,
      "filename" varchar,
      "mime_type" varchar,
      "filesize" numeric,
      "width" numeric,
      "height" numeric,
      "focal_x" numeric,
      "focal_y" numeric
    );
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "media_id" integer;
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  `)
}
