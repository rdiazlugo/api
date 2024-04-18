import { Hono } from "hono";

const api = new Hono();

api.get("/", (c) => c.json({ path: "/" }));

api.all("/:id", (c) => c.json({ id: c.req.query("id"), method: c.req.method }));

export default api;
