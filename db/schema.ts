import {
  pgTable,
  uuid,
  timestamp,
  text,
  pgEnum,
  json,
} from "drizzle-orm/pg-core";

const AuditType = pgEnum("auditName", ["read", "write", "delete"]);

export const AuditLog = pgTable("audit_logs", {
  id: uuid("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow(),
  keyId: text("key_id").notNull(),
  auditType: text("audit_type", { enum: ["api", "webhook"] }).notNull(),
  auditAction: text("audit_action", {
    enum: ["read", "write", "delete"],
  }).notNull(),
  data: json("data"),
});
