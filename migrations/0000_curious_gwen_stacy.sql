CREATE TABLE "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"address" jsonb NOT NULL,
	"phone" text NOT NULL,
	"website" text NOT NULL,
	"company" jsonb NOT NULL
);
