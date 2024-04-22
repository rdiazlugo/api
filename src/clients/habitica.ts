import forge from "mappersmith";

const HabiticaClient = forge({
  host: "https://habitica.com",
  clientId: "habitica",
  resources: {
    User: {
      get: { path: "/api/v3/user" },
    },
    Quest: {
      acceptByParty: {
        path: "/api/v3/groups/party/quests/accept",
        method: "post",
      },
    },
    Webhooks: {
      list: { path: "/api/v3/user/webhook" },
    },
  },
});

export default HabiticaClient;
