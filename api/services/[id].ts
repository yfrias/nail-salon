import type { VercelRequest, VercelResponse } from '@vercel/node'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

function fmt(s: { id: string; name: string; description: string; price: number; duration: number; category: string; image: string; active: boolean }) {
  return { id: s.id, name: s.name, description: s.description, price: s.price, duration: s.duration, category: s.category, image: s.image, active: s.active }
}

function getAdmin(req: VercelRequest): boolean {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return false
    const p = jwt.verify(token, process.env.JWT_SECRET!) as { role: string }
    return p.role === 'admin'
  } catch { return false }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!getAdmin(req)) { res.status(403).json({ error: 'Acceso denegado' }); return }
  const { id } = req.query as { id: string }
  if (req.method === 'PUT') {
    try {
      const service = await prisma.service.update({ where: { id }, data: req.body })
      res.json(fmt(service))
    } catch (e) { res.status(500).json({ error: String(e) }) }
    return
  }
  if (req.method === 'DELETE') {
    try {
      await prisma.service.delete({ where: { id } })
      res.status(204).end()
    } catch (e) { res.status(500).json({ error: String(e) }) }
    return
  }
  res.status(405).end()
}
