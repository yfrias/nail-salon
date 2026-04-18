import type { VercelRequest, VercelResponse } from '@vercel/node'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') { res.status(405).end(); return }
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) { res.status(401).json({ error: 'No autorizado' }); return }
    const auth = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string }
    const { id } = req.query as { id: string }
    const { currentPassword, newPassword } = req.body
    const isAdmin = auth.role === 'admin'
    const isSelf = auth.id === id
    if (!isAdmin && !isSelf) { res.status(403).json({ error: 'Acceso denegado' }); return }

    const target = await prisma.user.findUnique({ where: { id } })
    if (!target) { res.status(404).json({ error: 'Usuario no encontrado' }); return }

    if (!isAdmin || isSelf) {
      if (!currentPassword) { res.status(400).json({ error: 'Se requiere la contraseña actual' }); return }
      if (!(await bcrypt.compare(currentPassword, target.password))) {
        res.status(400).json({ error: 'Contraseña actual incorrecta' }); return
      }
    }
    await prisma.user.update({ where: { id }, data: { password: await bcrypt.hash(newPassword, 10) } })
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: String(e) }) }
}
