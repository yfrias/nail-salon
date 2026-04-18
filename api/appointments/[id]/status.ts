import type { VercelRequest, VercelResponse } from '@vercel/node'
import { AppointmentStatus } from '@prisma/client'
import { prisma } from '../../_lib/prisma'
import { requireAuth } from '../../_lib/auth'

function fmt(a: { id: string; clientId: string; clientName: string; clientEmail: string; clientPhone: string; serviceId: string; serviceName: string; servicePrice: number; date: string; time: string; notes: string; status: string; createdAt: Date }) {
  return { id: a.id, clientId: a.clientId, clientName: a.clientName, clientEmail: a.clientEmail, clientPhone: a.clientPhone, serviceId: a.serviceId, serviceName: a.serviceName, servicePrice: a.servicePrice, date: a.date, time: a.time, notes: a.notes, status: a.status, createdAt: a.createdAt.toISOString().split('T')[0] }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') { res.status(405).end(); return }
  if (!requireAuth(req, res)) return
  try {
    const { id } = req.query as { id: string }
    const { status } = req.body
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: status as AppointmentStatus },
    })
    res.json(fmt(appointment))
  } catch {
    res.status(500).json({ error: 'Error del servidor' })
  }
}
