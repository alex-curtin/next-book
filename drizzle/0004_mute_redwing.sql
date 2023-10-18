CREATE TABLE IF NOT EXISTS "book_categories" (
	"book_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	CONSTRAINT book_categories_book_id_category_id PRIMARY KEY("book_id","category_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "book_categories" ADD CONSTRAINT "book_categories_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "book_categories" ADD CONSTRAINT "book_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
