import { Request, Response } from 'express'
import prisma from '@/config/database'
import { ResponseData } from '@/utilities/Response'
import { Pagination } from '@/utilities/Pagination'

const AbsensiMuridController = {
  getAllAbsensiMurid: async (req: Request, res: Response): Promise<any> => {
    try {
      const page = new Pagination(
        parseInt(req.query.page as string) || 1,
        parseInt(req.query.limit as string) || 100,
      )

      const whereCondition = {
        deleteAt: null,
        user: {
          roleId: 1,
        },
      }

      const absensiMurid = await prisma.absensiMurid.findMany({
        where: whereCondition,
        include: {
          user: true,
        },
        skip: page.offset,
        take: page.limit,
        orderBy: {
          id: 'desc',
        },
      })

      const total = await prisma.absensiMurid.count({
        where: whereCondition,
      })

      return ResponseData.ok(res, {
        message: 'Berhasil mengambil semua data absensi murid',
        page: page.paginate({ count: total, rows: absensiMurid }),

        rows: absensiMurid,

      })
    } catch (error: any) {
      console.error('Error getAllAbsensi:', error)
      return ResponseData.serverError(res, error)
    }
  },

  getAbsensiMuridById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return ResponseData.badRequest(res, 'Invalid ID')

      const absensi = await prisma.absensiMurid.findUnique({
        where: { id },
      })

      if (!absensi) {
        return ResponseData.notFound(res, ' Id absensi not found')
      }

      return ResponseData.ok(res, absensi, 'Success get absensi by id')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },

  createAbsensiMurid: async (req: Request, res: Response) => {
    try {
      const userLogin = req.user as jwtPayloadInterface
      const { status, type, keterangan, userId, jadwalGuruId } = req.body
      console.log (req.body)

      // if (!status || !type || !keterangan || !jadwalGuruId) {
      //   return ResponseData.badRequest(res, 'Missing required fields')
      // }

      const schedule = await prisma.jadwalGuru.findFirst({
        where: { id: jadwalGuruId },
      })

      if (!schedule) {
        return ResponseData.notFound(res, 'Jadwal Not Found')
      }

      const muridId = userId != null ? userId : userLogin.id


      const now = new Date()
      const startOfDay = new Date(now)
      const endOfDay = new Date(now)
      startOfDay.setHours(0, 0, 0, 0)
      endOfDay.setHours(23, 59, 59, 999)

      const existingAbsensi = await prisma.absensiMurid.findFirst({
        where: {
          muridId: muridId,
          jadwalGuruId: jadwalGuruId,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
          deleteAt: null,
        },
      })

      if (existingAbsensi) {
        return ResponseData.badRequest(
          res,
          'Murid sudah melakukan absensi pada jadwal ini hari ini',
        )
      }

      const newAbsensiMurid = await prisma.absensiMurid.create({
        data: {
          status,
          type,
          keterangan,
          muridId: muridId,
          jadwalGuruId,
        },
      })

      return ResponseData.created(
        res,
        newAbsensiMurid,
        'Absensi created successfully',
      )
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },


  updateAbsensiMurid: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return ResponseData.badRequest(res, 'Invalid ID')

      const existing = await prisma.absensiMurid.findUnique({ where: { id } })
      if (!existing) {
        return ResponseData.notFound(res, 'Absensi not found')
      }

      const { status, type, keterangan } = req.body

      const updated = await prisma.absensiMurid.update({
        where: { id },
        data: { status, type, keterangan },
      })

      return ResponseData.ok(res, updated, 'Absensi updated successfully')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },

  deleteAbsensiMurid: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return ResponseData.badRequest(res, 'Invalid ID')

      const existing = await prisma.absensiMurid.findUnique({ where: { id } })
      if (!existing) {
        return ResponseData.notFound(res, 'Absensi not found')
      }


      const deleted = await prisma.absensiMurid.update({
        where: { id },
        data: { deleteAt: new Date() },
      })

      return ResponseData.ok(res, deleted, 'Absensi deleted successfully')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },
}

export default AbsensiMuridController
