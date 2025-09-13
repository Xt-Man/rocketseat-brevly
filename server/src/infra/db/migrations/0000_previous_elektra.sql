CREATE TABLE "urls" (
	"id" text PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"shortened_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"accessCount" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "urls_shortened_url_unique" UNIQUE("shortened_url")
);
