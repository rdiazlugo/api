import { verifyKey } from "discord-interactions"

const validateDiscordRequest = async (req: Request, body: string): Promise<void> => {
  const DISCORD_PUBLIC_KEY = Netlify.env.get("DISCORD_PUBLIC_KEY")
  if (!DISCORD_PUBLIC_KEY) throw new Response("Missing env DISCORD_PUBLIC_KEY", { status: 500 })

  const signature = req.headers.get("X-Signature-Ed25519") || "invalid"
  const timestamp = req.headers.get("X-Signature-Timestamp") || "invalid"
  const isValid = verifyKey(body, signature, timestamp, DISCORD_PUBLIC_KEY)
  if (!isValid) throw new Response("INVALID_DISCORD_REQUEST", { status: 401 })
}

export default validateDiscordRequest
