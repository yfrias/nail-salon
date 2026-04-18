import type { VercelRequest, VercelResponse } from '@vercel/node'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const prisma = new PrismaClient()
    const user = await prisma.user.findUnique({ where: { email: 'admin@nailstudio.com' } })
    await prisma.$disconnect()
    if (!user) { res.json({ ok: false, msg: 'user not found' }); return }
    const valid = await bcrypt.compare('admin123', user.password)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1m' })
    res.json({ ok: true, valid, hasToken: !!token, role: user.role })
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) })
  }
}
