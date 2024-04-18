import app from "./src/app";

Bun.serve({
  port: process.env.PORT || 3001,
  fetch: app.fetch,
});

console.log("running :)");
