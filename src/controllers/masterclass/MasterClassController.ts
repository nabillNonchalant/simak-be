import { Request, Response } from 'express'
import prisma from '@/config/database'
import { ResponseData } from '@/utilities/Response'

const Mastercalss = {
  getMasterclass: async (req: Request, res: Response) => {
    try {
      const userLogin = req.user as jwtPayloadInterface

      const Mastercalss = await prisma.masterClass.findMany({
    
      })

      if (Mastercalss.length === 0) {
        return ResponseData.notFound(res, 'Absensi not found')
      }

      return ResponseData.ok(res, Mastercalss, 'Success get absensi list')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },
}