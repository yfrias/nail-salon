import type { VercelRequest, VercelResponse } from '@vercel/node'
import { PrismaClient, AppointmentStatus } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

function fmt(a: { id: string; clientId: string; clientName: string; clientEmail: string; clientPhone: string; serviceId: string; serviceName: string; servicePrice: number; date: string; time: string; notes: string; status: string; createdAt: Date }) {
  return { id: a.id, clientId: a.clientId, clientName: a.clientName, clientEmail: a.clientEmail, clientPhone: a.clientPhone, serviceId: a.serviceId, serviceName: a.serviceName, servicePrice: a.servicePrice, date: a.date, time: a.time, notes: a.notes, status: a.status, createdAt: a.createdAt.toISOString().split('T')[0] }
}

function getUser(req: VercelRequest): { id: string; role: string } | null {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return null
    return jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string }
  } catch { return null }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = getUser(req)
  if (!user) { res.status(401).json({ error: 'No autorizado' }); return }

  if (req.method === 'GET') {
    try {
      const where = user.role === 'admin' ? {} : { clientId: user.id }
      const appointments = await prisma.appointment.findMany({ where, orderBy: { createdAt: 'desc' } })
      res.json(appointments.map(fmt))
    } catch (e) { res.status(500).json({ error: String(e) }) }
    return
  }
  if (req.method === 'POST') {
    try {
      const { clientId, clientName, clientEmail, clientPhone, serviceId, serviceName, servicePrice, date, time, notes, status } = req.body
      const appointment = await prisma.appointment.create({
        data: { clientId, clientName, clientEmail, clientPhone, serviceId, serviceName, servicePrice, date, time, notes: notes ?? '', status: status ?? AppointmentStatus.pending },
      })
      res.json(fmt(appointment))
    } catch (e) { res.status(500).json({ error: String(e) }) }
    return
  }
  res.status(405).end()
}
