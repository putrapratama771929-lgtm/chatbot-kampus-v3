CREATE TABLE "prodi" (
	"id" serial PRIMARY KEY NOT NULL,
	"jurusan_id" integer NOT NULL,
	"nama" text NOT NULL,
	"jenjang" text NOT NULL,
	"akreditasi" text DEFAULT 'B',
	"biaya" text,
	"deskripsi" text,
	"icon" text DEFAULT '🎓',
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "prodi" ADD CONSTRAINT "prodi_jurusan_id_jurusan_id_fk" FOREIGN KEY ("jurusan_id") REFERENCES "public"."jurusan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jurusan" DROP COLUMN "jenjang";--> statement-breakpoint
ALTER TABLE "jurusan" DROP COLUMN "akreditasi";--> statement-breakpoint
ALTER TABLE "jurusan" DROP COLUMN "biaya";