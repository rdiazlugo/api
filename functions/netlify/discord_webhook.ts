import type { Context } from "@netlify/functions";
import validateDiscordRequest from "../../src/middleware/discord";
import type { JSONObject } from "hono/utils/types";

const handler = async (req: Request, ctx: Context, data: JSONObject) => {
  console.log("data:", JSON.stringify(data, null, 2));
  return new Response("ok");
};

export default async (req: Request, ctx: Context) => {
  try {
    const bodyBuffer = Buffer.from(await req.arrayBuffer()).toString("utf-8");
    await validateDiscordRequest(req, bodyBuffer);
    const data = JSON.parse(bodyBuffer);
    return await handler(req, ctx, data);
  } catch (error: Error | Response | any) {
    if (error instanceof Response) {
      return error;
    }
    console.log("unhandled error in discord webhook", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
