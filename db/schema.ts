import { pgTable, timestamp, text, json, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { generatePublicId } from "./utils";

const timestapms = {
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").$onUpdate(() => new Date()),
};

export const User = pgTable("User", {
  id: text("id").primaryKey().$defaultFn(generatePublicId),
  email: text("email").notNull().unique(),
  ...timestapms,
});

export const userRelations = relations(User, ({ many }) => ({
  tokens: many(ApiToken),
  socialLogins: many(SocialLogin),
  devices: many(UserDevice),
}));

export const ApiToken = pgTable("ApiToken", {
  id: text("id").primaryKey().$defaultFn(generatePublicId),
  description: text("description").notNull(),
  key: text("key"),
  private_key: text("private_key").notNull().unique(),
  userId: text("userId").notNull(),
  ...timestapms,
});

export const apiTokenRelations = relations(ApiToken, ({ one }) => ({
  user: one(User, {
    fields: [ApiToken.userId],
    references: [User.id],
  }),
}));

export const SocialLogin = pgTable(
  "SocialLogin",
  {
    id: text("id").primaryKey().$defaultFn(generatePublicId),
    provider: text("provider").notNull(),
    email: text("email").notNull(),
    userId: text("userId").notNull(),
    profile: json("profile"),
    tokens: json("tokens"),
    ...timestapms,
  },
  (t) => ({
    unq: unique("SocialLogin_email_provider_key").on(t.email, t.provider),
  })
);

export const socialLoginRelations = relations(SocialLogin, ({ one }) => ({
  user: one(User, {
    fields: [SocialLogin.userId],
    references: [User.id],
  }),
}));

export const AuditLog = pgTable("audit_logs", {
  id: text("id").primaryKey().$defaultFn(generatePublicId),
  timestamp: timestamp("timestamp").defaultNow(),
  keyId: text("key_id").notNull(),
  auditType: text("audit_type", { enum: ["api", "webhook"] }).notNull(),
  auditAction: text("audit_action", {
    enum: ["read", "write", "delete"],
  }).notNull(),
  data: json("data"),
});

export const InvalidLogin = pgTable("InvalidLogin", {
  id: text("id").primaryKey().$defaultFn(generatePublicId),
  provider: text("provider").notNull(),
  email: text("email").notNull(),
  profile: json("profile"),
  tokens: json("tokens"),
  ...timestapms,
});

export const UserDevice = pgTable(
  "UserDevice",
  {
    id: text("id").primaryKey().$defaultFn(generatePublicId),
    userId: text("userId")
      .notNull()
      .references(() => User.id),
    name: text("name").notNull(),
    userAgent: text("userAgent").notNull(),

    ...timestapms,
  },
  (t) => ({
    unq: unique("UserDevice_userId_userAgent_key").on(t.userId, t.userAgent),
  })
);

export const userDeviceRelations = relations(UserDevice, ({ one, many }) => ({
  user: one(User, {
    fields: [UserDevice.userId],
    references: [User.id],
  }),
  pushSubscriptions: many(PushSubscription),
}));

export const PushSubscription = pgTable(
  "PushSubscription",
  {
    id: text("id").primaryKey().$defaultFn(generatePublicId),
    deviceId: text("deviceId")
      .notNull()
      .references(() => UserDevice.id),
    endpoint: text("endpoint").notNull(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    ...timestapms,
  },
  (t) => ({
    unq: unique("PushSubscription_deviceId_endpoint_auth_key").on(
      UserDevice.id,
      t.endpoint,
      t.auth
    ),
  })
);

export const pushSubscriptionRelations = relations(
  PushSubscription,
  ({ one }) => ({
    device: one(UserDevice, {
      fields: [PushSubscription.deviceId],
      references: [UserDevice.id],
    }),
  })
);
