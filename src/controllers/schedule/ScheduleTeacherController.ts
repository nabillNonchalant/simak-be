import { Request, Response } from 'express'
import prisma from '@/config/database'
import { ResponseData } from '@/utilities/Response'

const ScheduleTeacherController = {

  getJadwalGuru: async (req: Request, res: Response) => {
    try {
      const userLogin = req.user as jwtPayloadInterface

      const scheduleTeacher = await prisma.jadwalGuru.findMany({
        where: { userId: userLogin?.id },
      })

      if (scheduleTeacher.length === 0) {
        return ResponseData.notFound(res, 'Schedule not found')
      }

      return ResponseData.ok(res, scheduleTeacher, 'Success get schedule list')
    } catch (error: any) {
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
      const { tahunAjaran, mataPelajaran, kelas, grup } = req.body

      if (!tahunAjaran || !mataPelajaran || !kelas) {
        return ResponseData.badRequest(res, 'Missing required fields')
      }

      const newJadwal = await prisma.jadwalGuru.create({
        data: {
          tahunAjaran,
          mataPelajaran,
          kelas,
          grup,
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

      const { tahunAjaran, mataPelajaran, kelas, grup } = req.body

      const updated = await prisma.jadwalGuru.update({
        where: { id },
        data: { tahunAjaran, mataPelajaran, kelas, grup },
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
