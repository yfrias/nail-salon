import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function fmt(u: { id: string; name: string; email: string; phone: string; role: string; createdAt: Date }) {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role, createdAt: u.createdAt.toISOString().split('T')[0] }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') { res.status(405).end(); return }
  try {
    const { name, email, phone, password } = req.body
    if (await prisma.user.findUnique({ where: { email } })) {
      res.status(400).json({ error: 'Ya existe una cuenta con ese correo' }); return
    }
    const user = await prisma.user.create({
      data: { name, email, phone, password: await bcrypt.hash(password, 10), role: 'client' },
    })
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' })
    res.json({ user: fmt(user), token })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
}
