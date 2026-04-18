import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.json({
    ok: true,
    node: process.version,
    hasDB: !!process.env.DATABASE_URL,
    hasJWT: !!process.env.JWT_SECRET,
  })
}
