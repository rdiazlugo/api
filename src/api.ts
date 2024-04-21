import { Hono } from "hono";

const api = new Hono();

api.get("/", (c) => {
  return c.json({ message: "Hello, World!" });
});

export default api;
