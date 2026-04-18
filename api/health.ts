import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from './_lib/prisma'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    await prisma.$connect()
    const count = await prisma.user.count()
    res.json({ ok: true, users: count, db: 'connected' })
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) })
  }
}
