CREATE TABLE IF NOT EXISTS "ApiToken" (
	"id" text PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"key" text,
	"private_key" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT now(),
	"updatedAt" timestamp(3),
	CONSTRAINT "ApiToken_private_key_unique" UNIQUE("private_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "InvalidLogin" (
	"id" text PRIMARY KEY NOT NULL,
	"provider" text NOT NULL,
	"email" text NOT NULL,
	"profile" jsonb,
	"tokens" jsonb,
	"createdAt" timestamp(3) DEFAULT now(),
	"updatedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PushSubscription" (
	"id" text PRIMARY KEY NOT NULL,
	"deviceId" text NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT now(),
	"updatedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SocialLogin" (
	"id" text PRIMARY KEY NOT NULL,
	"provider" text NOT NULL,
	"email" text NOT NULL,
	"userId" text NOT NULL,
	"profile" jsonb,
	"tokens" jsonb,
	"createdAt" timestamp(3) DEFAULT now(),
	"updatedAt" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT now(),
	"updatedAt" timestamp(3),
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserDevice" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"userAgent" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT now(),
	"updatedAt" timestamp(3)
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "ApiToken_private_key_key" ON "ApiToken" ("private_key");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "InvalidLogin_email_key" ON "InvalidLogin" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "PushSubscription_deviceId_key" ON "PushSubscription" ("deviceId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "PushSubscription_deviceId_endpoint_auth_key" ON "PushSubscription" ("endpoint","deviceId","auth");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "SocialLogin_email_provider_key" ON "SocialLogin" ("provider","email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "UserDevice_userId_userAgent_key" ON "UserDevice" ("userAgent","userId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ApiToken" ADD CONSTRAINT "ApiToken_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_deviceId_UserDevice_id_fk" FOREIGN KEY ("deviceId") REFERENCES "UserDevice"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SocialLogin" ADD CONSTRAINT "SocialLogin_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserDevice" ADD CONSTRAINT "UserDevice_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
