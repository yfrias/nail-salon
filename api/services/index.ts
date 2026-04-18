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
  if (req.method === 'GET') {
    try {
      const services = await prisma.service.findMany({ orderBy: { name: 'asc' } })
      res.json(services.map(fmt))
    } catch (e) { res.status(500).json({ error: String(e) }) }
    return
  }
  if (req.method === 'POST') {
    if (!getAdmin(req)) { res.status(403).json({ error: 'Acceso denegado' }); return }
    try {
      const { name, description, price, duration, category, image, active } = req.body
      const service = await prisma.service.create({ data: { name, description, price, duration, category, image, active: active ?? true } })
      res.json(fmt(service))
    } catch (e) { res.status(500).json({ error: String(e) }) }
    return
  }
  res.status(405).end()
}
