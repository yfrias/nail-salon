import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import { prisma } from '../_lib/prisma'
import { requireAdmin } from '../_lib/auth'

function fmt(u: { id: string; name: string; email: string; phone: string; role: string; createdAt: Date }) {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role, createdAt: u.createdAt.toISOString().split('T')[0] }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } })
      res.json(users.map(fmt))
    } catch { res.status(500).json({ error: 'Error del servidor' }) }
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
    } catch { res.status(500).json({ error: 'Error del servidor' }) }
    return
  }

  res.status(405).end()
}
