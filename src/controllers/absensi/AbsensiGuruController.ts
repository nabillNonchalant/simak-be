import { Request, Response } from 'express'
import prisma from '@/config/database'
import { ResponseData } from '@/utilities/Response'

const AbsensiGuruController = {
  getAbsensiGuru: async (req: Request, res: Response) => {
    try {
      const userLogin = req.user as jwtPayloadInterface

      const absensiGuru = await prisma.absensiGuru.findMany({
        where: { userId: userLogin?.id },
      })

      if (absensiGuru.length === 0) {
        return ResponseData.notFound(res, 'Absensi not found')
      }

      return ResponseData.ok(res, absensiGuru, 'Success get absensi list')
    } catch (error: any) {
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
      const { jadwalGuruId, type, document, keterangan, status } = req.body

      if (!type || !keterangan || !document || !status) {
        return ResponseData.badRequest(res, 'Missing required fields')
      }

      const newAbsensi = await prisma.absensiGuru.create({
        data: {
          jadwalGuruId: Number(jadwalGuruId),
          type,
          keterangan,
          document,
          status,
          userId: userLogin.id,
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
