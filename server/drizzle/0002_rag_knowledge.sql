CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE "knowledge_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_key" text NOT NULL,
	"title" text NOT NULL,
	"source_type" text DEFAULT 'admin_text' NOT NULL,
	"reference_table" text,
	"reference_id" text,
	"content" text NOT NULL,
	"content_hash" text NOT NULL,
	"metadata" json,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "knowledge_chunks" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_id" integer NOT NULL,
	"chunk_index" integer NOT NULL,
	"content" text NOT NULL,
	"content_hash" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"metadata" json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_source_id_knowledge_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."knowledge_sources"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "knowledge_sources_source_key_idx" ON "knowledge_sources" USING btree ("source_key");
--> statement-breakpoint
CREATE INDEX "knowledge_sources_ref_idx" ON "knowledge_sources" USING btree ("source_type","reference_table","reference_id");
--> statement-breakpoint
CREATE INDEX "knowledge_sources_active_idx" ON "knowledge_sources" USING btree ("is_active");
--> statement-breakpoint
CREATE UNIQUE INDEX "knowledge_chunks_source_chunk_idx" ON "knowledge_chunks" USING btree ("source_id","chunk_index");
--> statement-breakpoint
CREATE INDEX "knowledge_chunks_source_idx" ON "knowledge_chunks" USING btree ("source_id");
--> statement-breakpoint
CREATE INDEX "knowledge_chunks_embedding_idx" ON "knowledge_chunks" USING hnsw ("embedding" vector_cosine_ops);
