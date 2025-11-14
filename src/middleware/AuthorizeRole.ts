import { Request, Response, NextFunction } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import { CONFIG } from '../config'

interface JwtPayload {
  id: number;
  role: {
    id: number;
    name: string;
    roleType: string;
  };
}

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, CONFIG.secret as unknown as Secret) as JwtPayload
      const userRole = decoded.role?.roleType

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden: role tidak diizinkan' })
      }

      // simpan data user ke request
      (req as any).user = decoded
      next()
    } catch (err) {
      return res.status(401).json({ message: 'Token tidak valid' })
    }
  }
}
