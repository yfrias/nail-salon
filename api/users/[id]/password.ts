import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import { prisma } from '../../_lib/prisma'
import { requireAuth } from '../../_lib/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') { res.status(405).end(); return }
  const user = requireAuth(req, res)
  if (!user) return

  try {
    const { id } = req.query as { id: string }
    const { currentPassword, newPassword } = req.body
    const isAdmin = user.role === 'admin'
    const isSelf = user.id === id
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
  } catch {
    res.status(500).json({ error: 'Error del servidor' })
  }
}
