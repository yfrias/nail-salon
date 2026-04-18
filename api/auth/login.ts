import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../_lib/prisma'

function fmt(u: { id: string; name: string; email: string; phone: string; role: string; createdAt: Date }) {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role, createdAt: u.createdAt.toISOString().split('T')[0] }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') { res.status(405).end(); return }
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Correo o contraseña incorrectos' }); return
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' })
    res.json({ user: fmt(user), token })
  } catch {
    res.status(500).json({ error: 'Error del servidor' })
  }
}
