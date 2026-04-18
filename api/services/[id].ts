import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_lib/prisma'
import { requireAdmin } from '../_lib/auth'

function fmt(s: { id: string; name: string; description: string; price: number; duration: number; category: string; image: string; active: boolean }) {
  return { id: s.id, name: s.name, description: s.description, price: s.price, duration: s.duration, category: s.category, image: s.image, active: s.active }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAdmin(req, res)) return
  const { id } = req.query as { id: string }

  if (req.method === 'PUT') {
    try {
      const service = await prisma.service.update({ where: { id }, data: req.body })
      res.json(fmt(service))
    } catch { res.status(500).json({ error: 'Error del servidor' }) }
    return
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.service.delete({ where: { id } })
      res.status(204).end()
    } catch { res.status(500).json({ error: 'Error del servidor' }) }
    return
  }

  res.status(405).end()
}
