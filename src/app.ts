import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import api from "./router";

if (!process.env.key) throw new Error("Missing env key");

const app = new Hono();

app.use(bearerAuth({ token: process.env.key }));

app.route("/api", api);

export default app;
