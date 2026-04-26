CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "beasiswa" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"deskripsi" text,
	"icon" text DEFAULT '🏅',
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"sender" text NOT NULL,
	"message" text NOT NULL,
	"matched_intent" text,
	"confidence_score" real,
	"response_type" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_uuid" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"started_at" timestamp DEFAULT now(),
	"last_activity" timestamp DEFAULT now(),
	CONSTRAINT "chat_sessions_session_uuid_unique" UNIQUE("session_uuid")
);
--> statement-breakpoint
CREATE TABLE "faq" (
	"id" serial PRIMARY KEY NOT NULL,
	"pertanyaan" text NOT NULL,
	"jawaban" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "fasilitas" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"icon" text DEFAULT '🏫',
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "intents" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"keywords" json NOT NULL,
	"exact_match" json,
	"response_type" text DEFAULT 'text' NOT NULL,
	"response_template" text,
	"intro_text" text,
	"data_source" text,
	"is_active" boolean DEFAULT true,
	"priority" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "intents_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "jurusan" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"jenjang" text NOT NULL,
	"akreditasi" text DEFAULT 'B',
	"icon" text DEFAULT '🎓',
	"biaya" text,
	"deskripsi" text,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kampus_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"singkatan" text,
	"alamat" text,
	"telepon" text,
	"email" text,
	"website" text,
	"whatsapp" text,
	"maps_url" text,
	"visi" text,
	"misi" json,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "kontak" (
	"id" serial PRIMARY KEY NOT NULL,
	"tipe" text NOT NULL,
	"label" text NOT NULL,
	"value" text NOT NULL,
	"url" text,
	"icon" text DEFAULT '📞',
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "pendaftaran" (
	"id" serial PRIMARY KEY NOT NULL,
	"jalur" text NOT NULL,
	"nama" text NOT NULL,
	"periode" text,
	"syarat" text,
	"biaya_pendaftaran" text,
	"icon" text DEFAULT '📝',
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_chat_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."chat_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "msg_session_idx" ON "chat_messages" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "msg_intent_idx" ON "chat_messages" USING btree ("matched_intent");--> statement-breakpoint
CREATE INDEX "msg_created_idx" ON "chat_messages" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "session_uuid_idx" ON "chat_sessions" USING btree ("session_uuid");--> statement-breakpoint
CREATE INDEX "session_started_idx" ON "chat_sessions" USING btree ("started_at");