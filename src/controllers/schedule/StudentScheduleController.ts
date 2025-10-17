import { Request, Response } from 'express'
import prisma from '@/config/database'
import { ResponseData } from '@/utilities/Response'

const StudentScheduleController = {

  getJadwalMurid: async (req: Request, res: Response) => {
    try {
      const userLogin = req.user as jwtPayloadInterface

      const StudentSchedule = await prisma.jadwalMurid.findMany({
        where: { muridId: userLogin?.id },
      })

      if (StudentSchedule.length === 0) {
        return ResponseData.notFound(res, 'Schedule not found')
      }

      return ResponseData.ok(res, StudentSchedule, 'Success get schedule list')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },


  getJadwalMuridById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return ResponseData.badRequest(res, 'Invalid ID')

      const jadwal = await prisma.jadwalMurid.findUnique({
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
  


  createJadwalMurid: async (req: Request, res: Response) => {
    try {
      const userLogin = req.user as jwtPayloadInterface
      const { namaLengkap, kelas, kelamin } = req.body

      if (!namaLengkap || !kelas || !kelamin) {
        return ResponseData.badRequest(res, 'Missing required fields')
      }

      const newJadwalMurid= await prisma.jadwalMurid.create({
        data: {
          namaLengkap,   
          kelas,
          kelamin,
          muridId: userLogin.id,  
          jadwalGuruId: req.body.jadwalGuruId,
        },
      })

      return ResponseData.created(res, newJadwalMurid, 'Jadwal created successfully')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },


  updateJadwalMurid: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return ResponseData.badRequest(res, 'Invalid ID')

      const existing = await prisma.jadwalMurid.findUnique({ where: { id } })
      if (!existing) {
        return ResponseData.notFound(res, 'Jadwal not found')
      }

      const { namaLengkap, kelas, kelamin } = req.body

      const updated = await prisma.jadwalMurid.update({
        where: { id },
        data: { namaLengkap, kelas, kelamin },
      })

      return ResponseData.ok(res, updated, 'Jadwal updated successfully')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },


  deleteJadwalMurid: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return ResponseData.badRequest(res, 'Invalid ID')

      const existing = await prisma.jadwalMurid.findUnique({ where: { id } })
      if (!existing) {
        return ResponseData.notFound(res, 'Jadwal not found')
      }


      const deleted = await prisma.jadwalMurid.update({
        where: { id },
        data: { deleteAt: new Date() },
      })

      return ResponseData.ok(res, deleted, 'Jadwal deleted successfully')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },
}

export default StudentScheduleController
