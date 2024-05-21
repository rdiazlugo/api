import forge, { type Middleware } from "mappersmith";
import { EncodeJsonMiddleware, LogMiddleware } from "mappersmith/middleware";

export const USER_ID = Netlify?.env.get("HABITICA_USER_ID") ?? "INVALID";
const API_TOKEN = Netlify?.env.get("HABITICA_API_TOKEN") ?? "INVALID";

const AuthMiddleware: Middleware = () => ({
  prepareRequest(next) {
    return next().then((request) =>
      request.enhance({
        headers: { "x-api-user": USER_ID, "x-api-key": API_TOKEN },
      })
    );
  },
});

const HabiticaClient = forge({
  host: "https://habitica.com/api/v3",
  clientId: "habitica",
  middleware: [AuthMiddleware, EncodeJsonMiddleware, LogMiddleware],
  resources: {
    User: {
      get: { path: "/user" },
    },
    Quest: {
      acceptByParty: {
        path: "/groups/{groupId}/quests/accept",
        params: { groupId: "party" },
        method: "post",
      },
    },
    Webhooks: {
      list: { path: "/user/webhook" },
    },
    Chat: {
      sendGroupMessage: {
        path: "/groups/{groupId}/chat",
        params: { groupId: "party" },
        method: "post",
      },
    },
  },
});

export default HabiticaClient;
