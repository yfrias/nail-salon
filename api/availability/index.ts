import type { VercelRequest, VercelResponse } from '@vercel/node'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

const DEFAULT_CONFIG = {
  id: 'default',
  activeMonths: '0,1,2,3,4,5,6,7,8,9,10,11',
  activeDays: '1,2,3,4,5,6',
  timeStart: '09:00',
  timeEnd: '17:30',
  intervalMin: 30,
}

function getUser(req: VercelRequest): { id: string; role: string } | null {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return null
    return jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string }
  } catch { return null }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const config = await prisma.availabilityConfig.findUnique({ where: { id: 'default' } })
      res.json(config ?? DEFAULT_CONFIG)
    } catch (e) { res.status(500).json({ error: String(e) }) }
    return
  }

  if (req.method === 'PUT') {
    const user = getUser(req)
    if (!user || user.role !== 'admin') { res.status(401).json({ error: 'No autorizado' }); return }
    try {
      const { activeMonths, activeDays, timeStart, timeEnd, intervalMin } = req.body
      const config = await prisma.availabilityConfig.upsert({
        where: { id: 'default' },
        update: { activeMonths, activeDays, timeStart, timeEnd, intervalMin },
        create: { id: 'default', activeMonths, activeDays, timeStart, timeEnd, intervalMin },
      })
      res.json(config)
    } catch (e) { res.status(500).json({ error: String(e) }) }
    return
  }

  res.status(405).end()
}
