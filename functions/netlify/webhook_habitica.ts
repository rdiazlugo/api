import type { Context } from "@netlify/functions";
import habitica, { USER_ID } from "../../src/clients/habitica";

const isOwnStartedQuest = (type: string, data: any) =>
  type === "questStarted" && data?.quest?.questOwner === USER_ID;

const isQuestInvitation = (type: string) => type === "questInvited";

const handler = async (req: Request, ctx: Context, data: any) => {
  const { webhookType = "", type } = data || {};
  console.log({ webhookType, type });
  switch (webhookType) {
    case "questActivity":
      console.log(JSON.stringify(data, null, 2));

      if (isOwnStartedQuest(type, data)) {
        await habitica.Chat.sendGroupMessage({
          body: { message: "Good luck with the quest everyone! 👋" },
        });
        return;
      }
      if (isQuestInvitation(type)) {
        await habitica.Quest.acceptByParty();
        await habitica.Chat.sendGroupMessage({
          body: { message: "New quest, niice! 🎉" },
        });
      }
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
