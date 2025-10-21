import { Request, Response } from 'express'
import prisma from '@/config/database'
import { ResponseData } from '@/utilities/Response'

const AbsensiMuridController = {
  getAbsensiMurid: async (req: Request, res: Response) => {
    try {
      const userLogin = req.user as jwtPayloadInterface

      const absensiMurid = await prisma.absensiMurid.findMany({
        where: { muridId: userLogin.id },
      })

      if (absensiMurid.length === 0) {
        return ResponseData.notFound(res, 'Absensi not found')
      }

      return ResponseData.ok(res, absensiMurid, 'Success get absensi list')
    } catch (error: any) {
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
      const { status, type, keterangan } = req.body

      if (!status || !type || !keterangan) {
        return ResponseData.badRequest(res, 'Missing required fields')
      }

      const newAbsensiMurid= await prisma.absensiMurid.create({
        data: {
          status,   
          type,
          keterangan,
          muridId: userLogin.id,  
          jadwalGuruId: req.body.jadwalGuruId,
        },
      })

      return ResponseData.created(res, newAbsensiMurid, 'Absensi created successfully')
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
