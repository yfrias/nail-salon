import type { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'

export interface AuthUser { id: string; role: string }

export function getAuth(req: VercelRequest): AuthUser | null {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return null
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as AuthUser
  } catch {
    return null
  }
}

export function requireAuth(req: VercelRequest, res: VercelResponse): AuthUser | null {
  const user = getAuth(req)
  if (!user) { res.status(401).json({ error: 'No autorizado' }); return null }
  return user
}

export function requireAdmin(req: VercelRequest, res: VercelResponse): AuthUser | null {
  const user = requireAuth(req, res)
  if (!user) return null
  if (user.role !== 'admin') { res.status(403).json({ error: 'Acceso denegado' }); return null }
  return user
}
