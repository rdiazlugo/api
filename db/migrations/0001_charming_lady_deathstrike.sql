ALTER TABLE "audit_logs" ADD COLUMN "audit_action" text NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "correlation_id" uuid;