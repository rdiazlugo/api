import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import api from "./router";
import { runMigrations } from "../db";

if (!process.env.key) throw new Error("Missing env key");

await runMigrations();
const app = new Hono();

app.use(bearerAuth({ token: process.env.key }));

app.route("/api", api);

export default app;
