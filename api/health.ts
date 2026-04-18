import type { VercelRequest, VercelResponse } from '@vercel/node'
import { PrismaClient } from '@prisma/client'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const prisma = new PrismaClient()
    const count = await prisma.user.count()
    await prisma.$disconnect()
    res.json({ ok: true, users: count })
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) })
  }
}
