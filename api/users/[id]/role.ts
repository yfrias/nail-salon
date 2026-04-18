import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../../_lib/prisma'
import { requireAdmin } from '../../_lib/auth'

function fmt(u: { id: string; name: string; email: string; phone: string; role: string; createdAt: Date }) {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role, createdAt: u.createdAt.toISOString().split('T')[0] }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') { res.status(405).end(); return }
  const admin = requireAdmin(req, res)
  if (!admin) return

  try {
    const { id } = req.query as { id: string }
    if (admin.id === id) { res.status(400).json({ error: 'No puedes cambiar tu propio rol' }); return }

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) { res.status(404).json({ error: 'Usuario no encontrado' }); return }

    const updated = await prisma.user.update({
      where: { id },
      data: { role: user.role === 'admin' ? 'client' : 'admin' },
    })
    res.json(fmt(updated))
  } catch {
    res.status(500).json({ error: 'Error del servidor' })
  }
}
