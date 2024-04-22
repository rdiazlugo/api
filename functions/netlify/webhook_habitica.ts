import type { Context } from "@netlify/functions";
import type { JSONObject } from "hono/utils/types";
import habitica from "../../src/clients/habitica";

const USER_ID = Netlify.env.get("HABITICA_USER_ID");
const API_TOKEN = Netlify.env.get("HABITICA_API_TOKEN");

const headers = {
  "x-client": USER_ID + "-" + "rdiazlugo-api",
  "x-api-user": USER_ID,
  "x-api-key": API_TOKEN,
};

const handler = async (req: Request, ctx: Context, data: JSONObject) => {
  const { webhookType = "", type } = data || {};
  console.log({ webhookType, type });
  switch (webhookType) {
    case "questActivity":
      console.log(JSON.stringify(data, null, 2));
      // await HabiticaClient.Quest.acceptByParty({ headers });
      break;

    default:
      break;
  }
  return new Response("ok");
};

export default async (req: Request, ctx: Context) => {
  try {
    const bodyBuffer = Buffer.from(await req.arrayBuffer()).toString("utf-8");
    const data = JSON.parse(bodyBuffer);
    return await handler(req, ctx, data);
  } catch (error: Error | Response | any) {
    if (error instanceof Response) {
      return error;
    }
    console.log("unhandled error in habitica webhook", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
