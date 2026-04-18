import type { VercelRequest, VercelResponse } from '@vercel/node'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

function fmt(u: { id: string; name: string; email: string; phone: string; role: string; createdAt: Date }) {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role, createdAt: u.createdAt.toISOString().split('T')[0] }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') { res.status(405).end(); return }
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) { res.status(401).json({ error: 'No autorizado' }); return }
    const auth = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string }
    if (auth.role !== 'admin') { res.status(403).json({ error: 'Acceso denegado' }); return }
    const { id } = req.query as { id: string }
    if (auth.id === id) { res.status(400).json({ error: 'No puedes cambiar tu propio rol' }); return }
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) { res.status(404).json({ error: 'Usuario no encontrado' }); return }
    const updated = await prisma.user.update({ where: { id }, data: { role: user.role === 'admin' ? 'client' : 'admin' } })
    res.json(fmt(updated))
  } catch (e) { res.status(500).json({ error: String(e) }) }
}
