import { Hono } from "hono";
import api from "./api";
import { runMigrations } from "../db";
import tokenMiddleware from "./middleware/token";

await runMigrations();
const app = new Hono();
app.use(tokenMiddleware);

app.route("/api", api);

export default app;
