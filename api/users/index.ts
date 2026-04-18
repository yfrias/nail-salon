import type { VercelRequest, VercelResponse } from '@vercel/node'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

function fmt(u: { id: string; name: string; email: string; phone: string; role: string; createdAt: Date }) {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role, createdAt: u.createdAt.toISOString().split('T')[0] }
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

  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } })
      res.json(users.map(fmt))
    } catch (e) { res.status(500).json({ error: String(e) }) }
    return
  }
  if (req.method === 'POST') {
    try {
      const { name, email, phone, password } = req.body
      if (await prisma.user.findUnique({ where: { email } })) {
        res.status(400).json({ error: 'Ya existe una cuenta con ese correo' }); return
      }
      const user = await prisma.user.create({
        data: { name, email, phone, password: await bcrypt.hash(password || '123456', 10), role: 'client' },
      })
      res.json(fmt(user))
    } catch (e) { res.status(500).json({ error: String(e) }) }
    return
  }
  res.status(405).end()
}
