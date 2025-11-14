import { NextFunction, Response, Request } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '@/config/database'
import { CONFIG } from '@/config'
import { ResponseData } from '@/utilities/Response'
import { verifyAccesToken } from '@/utilities/JwtHanldler'
import { jwtPayloadInterface } from '@/types/jwtpayloadinterface'

declare module 'express-serve-static-core' {
  interface Request {
    user?: jwtPayloadInterface
  }
}

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader ? authHeader.split(' ')[1] : undefined

  if (!token) {
    return ResponseData.unauthorized(res, 'Unauthorized - No token provided')
  }

  try {
    const session = await prisma.session.findUnique({
      where: { token },
    })

    if (!session) {
      return ResponseData.unauthorized(res, 'Unauthorized - Invalid session')
    }

    const decoded = verifyAccesToken(token, CONFIG.secret.jwtSecret)

    if (!decoded) {
      return ResponseData.unauthorized(res, 'Unauthorized - Invalid token')
    }

    req.user = decoded as unknown as jwtPayloadInterface

    next()
  } catch (error: any) {
    return ResponseData.unauthorized(res, `Unauthorized - ${error.message || 'An error occurred'}`)
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ResponseData.unauthorized(res, 'Token tidak ditemukan')
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, CONFIG.secret.jwtSecret) as jwtPayloadInterface
    req.user = decoded
    next()
  } catch (error) {
    return ResponseData.unauthorized(res, 'Token tidak valid atau sudah kedaluwarsa')
  }
}
