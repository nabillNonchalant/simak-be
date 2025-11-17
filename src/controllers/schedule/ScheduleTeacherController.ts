import { Request, Response } from 'express'
import prisma from '@/config/database'
import { ResponseData } from '@/utilities/Response'
import { Pagination } from '@/utilities/Pagination'

const ScheduleTeacherController = {

  getAllJadwal: async (req: Request, res: Response): Promise<any> => {
    try {
      const page = new Pagination(
        parseInt(req.query.page as string) || 1,
        parseInt(req.query.limit as string) || 100,
      )

      const whereCondition: any = { deleteAt: null }

      const jadwalGuru = await prisma.jadwalGuru.findMany({
        where: whereCondition,
        include: {
          absensiGuru: true,
        },
        skip: page.offset,
        take: page.limit,
        orderBy: {
          id: 'desc',
        },
      })

      const total = await prisma.jadwalGuru.count({
        where: whereCondition,
      })

      return ResponseData.ok(res, {
        message: 'Berhasil mengambil semua data jadwal guru',
        page: page.paginate({ count: total, rows: jadwalGuru }),

        rows: jadwalGuru,

      })
    } catch (error: any) {
      console.error('Error getAllJadwal:', error)
      return ResponseData.serverError(res, error)
    }
  },


  getJadwalGuruById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return ResponseData.badRequest(res, 'Invalid ID')

      const jadwal = await prisma.jadwalGuru.findUnique({
        where: { id },
      })

      if (!jadwal) {
        return ResponseData.notFound(res, 'Jadwal not found')
      }

      return ResponseData.ok(res, jadwal, 'Success get jadwal by id')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },
  


  createJadwalGuru: async (req: Request, res: Response) => {
    try {
      const userLogin = req.user as jwtPayloadInterface
      const { tahunAjaran, mataPelajaran, classId } = req.body

      if (!tahunAjaran || !mataPelajaran || !classId) {
        return ResponseData.badRequest(res, 'Missing required fields')
      }

      const newJadwal = await prisma.jadwalGuru.create({
        data: {
          tahunAjaran,
          mataPelajaran,
          classId,
          userId: userLogin.id,
        },
      })

      return ResponseData.created(res, newJadwal, 'Jadwal created successfully')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },


  updateJadwalGuru: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return ResponseData.badRequest(res, 'Invalid ID')

      const existing = await prisma.jadwalGuru.findUnique({ where: { id } })
      if (!existing) {
        return ResponseData.notFound(res, 'Jadwal not found')
      }

      const { tahunAjaran, mataPelajaran, classId } = req.body

      const updated = await prisma.jadwalGuru.update({
        where: { id },
        data: { tahunAjaran, mataPelajaran, classId },
      })

      return ResponseData.ok(res, updated, 'Jadwal updated successfully')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },


  deleteJadwalGuru: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return ResponseData.badRequest(res, 'Invalid ID')

      const existing = await prisma.jadwalGuru.findUnique({ where: { id } })
      if (!existing) {
        return ResponseData.notFound(res, 'Jadwal not found')
      }


      const deleted = await prisma.jadwalGuru.update({
        where: { id },
        data: { deleteAt: new Date() },
      })

      return ResponseData.ok(res, deleted, 'Jadwal deleted successfully')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },
}

export default ScheduleTeacherController
