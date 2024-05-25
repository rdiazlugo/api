import { Hono } from "hono"

const api = new Hono()

api.get("/", (c) => {
  return c.json({ message: "Hello, World!" })
})

api.post("/file", async (c) => {
  console.log(c.req.header())
  const body = await c.req.parseBody()
  console.log(body["file"])
  return c.json({ message: "File received" })
})

export default api
