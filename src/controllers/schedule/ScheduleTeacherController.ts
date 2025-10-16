import { Request, Response } from 'express'
import prisma from '@/config/database'
import { ResponseData } from '@/utilities/Response'

const ScheduleTeacherController = {
  getJadwalGuru : async (req: Request, res: Response): Promise<any> => {
    try {
      const userLogin = req.user as jwtPayloadInterface

      const whereCondition = {} as any

      whereCondition.userId = userLogin?.id

      const scheduleTeacher = await prisma.jadwalGuru.findMany({
        where: whereCondition,
      })

      if (!scheduleTeacher) {
        return ResponseData.notFound(res, 'Schedule Not Found')

      }

      return ResponseData.ok(res, scheduleTeacher, 'Success Get Data')


    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },

  getJadwalGuruById : async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = parseInt(req.params.id as string)
      const userData = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!userData) {
        return ResponseData.notFound(res, 'Jadwal not found')
      }

      return ResponseData.ok(res, userData, 'Success get jadwal by id')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }



  
  },
  


}

export default ScheduleTeacherController