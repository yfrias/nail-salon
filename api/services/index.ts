import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_lib/prisma'
import { requireAdmin } from '../_lib/auth'

function fmt(s: { id: string; name: string; description: string; price: number; duration: number; category: string; image: string; active: boolean }) {
  return { id: s.id, name: s.name, description: s.description, price: s.price, duration: s.duration, category: s.category, image: s.image, active: s.active }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const services = await prisma.service.findMany({ orderBy: { name: 'asc' } })
      res.json(services.map(fmt))
    } catch { res.status(500).json({ error: 'Error del servidor' }) }
    return
  }

  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return
    try {
      const { name, description, price, duration, category, image, active } = req.body
      const service = await prisma.service.create({ data: { name, description, price, duration, category, image, active: active ?? true } })
      res.json(fmt(service))
    } catch { res.status(500).json({ error: 'Error del servidor' }) }
    return
  }

  res.status(405).end()
}
