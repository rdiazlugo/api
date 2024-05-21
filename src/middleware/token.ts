import { bearerAuth } from "hono/bearer-auth";
import type { Context } from "hono";
import { db } from "../../db";

if (!process.env.key) throw new Error("Missing env key");

export const verifyToken = async (token: string, c: Context) => {
  if (!token) return false;
  const _token = await db.query.ApiToken.findFirst({
    where: (t, { eq }) => eq(t.privateKey, token),
    with: { user: true },
  });
  if (_token?.privateKey === token) return true;
  return false;
};

const tokenMiddleware = bearerAuth({ verifyToken });

export default tokenMiddleware;
