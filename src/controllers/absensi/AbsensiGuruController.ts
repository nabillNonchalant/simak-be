import { Request, Response } from 'express'
import prisma from '@/config/database'
import { ResponseData } from '@/utilities/Response'
import { Pagination } from '@/utilities/Pagination'
import { number } from 'zod/v4'

const AbsensiGuruController = {
  getAllAbsensiguru: async (req: Request, res: Response): Promise<any> => {
    try {
      const page = new Pagination(
        parseInt(req.query.page as string) || 1,
        parseInt(req.query.limit as string) || 100,
      )

      const whereCondition: any = { deleteAt: null }


      const absensiGuru = await prisma.absensiGuru.findMany({
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

      const total = await prisma.absensiGuru.count({
        where: whereCondition,
      })

      return ResponseData.ok(res, {
        message: 'Berhasil mengambil semua data absensi murid',
        page: page.paginate({ count: total, rows: absensiGuru }),

        rows: absensiGuru,

      })
    } catch (error: any) {
      console.error('Error getAllAbsensi:', error)
      return ResponseData.serverError(res, error)
    }
  },


  getAbsensiGuruById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return ResponseData.badRequest(res, 'Invalid ID')

      const absensi = await prisma.absensiGuru.findUnique({
        where: { id },
      })

      if (!absensi) {
        return ResponseData.notFound(res, 'Absensi not found')
      }

      return ResponseData.ok(res, absensi, 'Success get absensi by id')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },

  createAbsensiGuru: async (req: Request, res: Response) => {
    try {
      const userLogin = req.user as jwtPayloadInterface
      const { jadwalGuruId, type, document, keterangan, status, userId } = req.body

      // // if (!type || !keterangan || !document || !status || !jadwalGuruId || !userId ) {
      // //   // return ResponseData.badRequest(res, 'Missing required fields')
      // }

      const schedule = await prisma.jadwalGuru.findFirst({
        where: {
          id: Number(jadwalGuruId),
        },
      })

      if (!schedule) {
        return ResponseData.notFound(res, 'Jadwal Not Found')
      }

      const now = new Date()
      const startOfDay = new Date(now)
      const endOfDay = new Date(now)
      startOfDay.setHours(0, 0, 0, 0)
      endOfDay.setHours(23, 59, 59, 999)

      const existingAbsensi = await prisma.absensiGuru.findFirst({
        where: {
          userId: Number(userId),
          jadwalGuruId: Number(jadwalGuruId),
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
          'Guru sudah melakukan absensi untuk jadwal ini hari ini',
        )
      }

      const newAbsensi = await prisma.absensiGuru.create({
        data: {
          jadwalGuruId: Number(jadwalGuruId),
          type,
          keterangan,
          document,
          status,
          userId: Number(userId),
        },
      })

      return ResponseData.created(res, newAbsensi, 'Success create absensi')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },

  updateAbsensiGuru: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return ResponseData.badRequest(res, 'Invalid ID')

      const existingAbsensi = await prisma.absensiGuru.findUnique({
        where: { id },
      })

      if (!existingAbsensi) {
        return ResponseData.notFound(res, 'Absensi not found')
      }

      const { type, keterangan, document, status } = req.body

      const updatedAbsensi = await prisma.absensiGuru.update({
        where: { id },
        data: {
          type,
          keterangan,
          document,
          status,
        },
      })

      return ResponseData.ok(res, updatedAbsensi, 'Success update absensi')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },

  deleteAbsensiGuru: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return ResponseData.badRequest(res, 'Invalid ID')

      const existingAbsensi = await prisma.absensiGuru.findUnique({
        where: { id },
      })

      if (!existingAbsensi) {
        return ResponseData.notFound(res, 'Absensi not found')
      }

      await prisma.absensiGuru.delete({
        where: { id },
      })

      return ResponseData.ok(res, null, 'Success delete absensi')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },
}

export default AbsensiGuruController
