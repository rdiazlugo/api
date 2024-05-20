import {
  pgTable,
  timestamp,
  text,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { generatePublicId } from "./utils";

const timestapms = {
  createdAt: timestamp("createdAt", {
    precision: 3,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", { precision: 3, mode: "string" }).$onUpdate(
    () => new Date().toISOString()
  ),
};

export const User = pgTable(
  "User",
  {
    id: text("id").primaryKey().$defaultFn(generatePublicId),
    email: text("email").notNull().unique(),
    ...timestapms,
  },
  (t) => ({
    emailKey: uniqueIndex("User_email_key").on(t.email),
  })
);

export const userRelations = relations(User, ({ many }) => ({
  tokens: many(ApiToken),
  socialLogins: many(SocialLogin),
  devices: many(UserDevice),
}));

export const ApiToken = pgTable(
  "ApiToken",
  {
    id: text("id").primaryKey().$defaultFn(generatePublicId),
    description: text("description").notNull(),
    key: text("key"),
    privateKey: text("private_key").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => User.id, { onDelete: "cascade", onUpdate: "cascade" }),
    ...timestapms,
  },
  (t) => ({
    privateKeyKey: uniqueIndex("ApiToken_private_key_key").on(t.privateKey),
  })
);

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
    userId: text("userId")
      .notNull()
      .references(() => User.id, { onDelete: "cascade", onUpdate: "cascade" }),
    profile: jsonb("profile"),
    tokens: jsonb("tokens"),
    ...timestapms,
  },
  (t) => ({
    emailProviderKey: uniqueIndex("SocialLogin_email_provider_key").on(
      t.provider,
      t.email
    ),
  })
);

export const InvalidLogin = pgTable(
  "InvalidLogin",
  {
    id: text("id").primaryKey().$defaultFn(generatePublicId),
    provider: text("provider").notNull(),
    email: text("email").notNull(),
    profile: jsonb("profile"),
    tokens: jsonb("tokens"),
    ...timestapms,
  },
  (t) => ({
    emailKey: uniqueIndex("InvalidLogin_email_key").on(t.email),
  })
);

export const UserDevice = pgTable(
  "UserDevice",
  {
    id: text("id").primaryKey().$defaultFn(generatePublicId),
    userId: text("userId")
      .notNull()
      .references(() => User.id, { onDelete: "cascade", onUpdate: "cascade" }),
    name: text("name").notNull(),
    userAgent: text("userAgent").notNull(),
    ...timestapms,
  },
  (t) => ({
    userIdUserAgentKey: uniqueIndex("UserDevice_userId_userAgent_key").on(
      t.userAgent,
      t.userId
    ),
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
      .references(() => UserDevice.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    endpoint: text("endpoint").notNull(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    ...timestapms,
  },
  (t) => ({
    deviceIdKey: uniqueIndex("PushSubscription_deviceId_key").on(t.deviceId),
    deviceIdEndpointAuthKey: uniqueIndex(
      "PushSubscription_deviceId_endpoint_auth_key"
    ).on(t.endpoint, t.deviceId, t.auth),
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
