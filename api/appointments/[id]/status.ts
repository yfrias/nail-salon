import type { VercelRequest, VercelResponse } from '@vercel/node'
import { PrismaClient, AppointmentStatus } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

function fmt(a: { id: string; clientId: string; clientName: string; clientEmail: string; clientPhone: string; serviceId: string; serviceName: string; servicePrice: number; date: string; time: string; notes: string; status: string; createdAt: Date }) {
  return { id: a.id, clientId: a.clientId, clientName: a.clientName, clientEmail: a.clientEmail, clientPhone: a.clientPhone, serviceId: a.serviceId, serviceName: a.serviceName, servicePrice: a.servicePrice, date: a.date, time: a.time, notes: a.notes, status: a.status, createdAt: a.createdAt.toISOString().split('T')[0] }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') { res.status(405).end(); return }
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) { res.status(401).json({ error: 'No autorizado' }); return }
    jwt.verify(token, process.env.JWT_SECRET!)
    const { id } = req.query as { id: string }
    const { status } = req.body
    const appointment = await prisma.appointment.update({ where: { id }, data: { status: status as AppointmentStatus } })
    res.json(fmt(appointment))
  } catch (e) { res.status(500).json({ error: String(e) }) }
}
