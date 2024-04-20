CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	"key_id" text NOT NULL,
	"audit_type" "auditName" NOT NULL,
	"data" json
);
