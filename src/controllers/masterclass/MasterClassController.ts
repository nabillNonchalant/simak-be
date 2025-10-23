/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express'
import prisma from '@/config/database'
import { ResponseData } from '@/utilities/Response'
import { Pagination } from '@/utilities/Pagination'
import { UserSchemaForCreate, UserSchemaForUpdate } from '@/schema/UserSchema'
import { validateInput } from '@/utilities/ValidateHandler'
import { getIO } from '@/config/socket'
import { logActivity } from '@/utilities/LogActivity'
import redisClient from '@/config/redis'

const MasterClassController = {
  getAllClass: async (req: Request, res: Response): Promise<any> => {
    try {
      const page = new Pagination(
        parseInt(req.query.page as string) || 1,
        parseInt(req.query.limit as string) || 100,
      )

      const whereCondition: any = { deleteAt: null }

      const classes = await prisma.masterClass.findMany({
        where: whereCondition,
        include: {
          jadwalGuru: true,
        },
        skip: page.offset,
        take: page.limit,
        orderBy: {
          id: 'desc',
        },
      })

      const total = await prisma.masterClass.count({
        where: whereCondition,
      })

      return ResponseData.ok(res, {
        message: 'Berhasil mengambil semua data master class',
        page: page.paginate({ count: total, rows: classes }),

        rows: classes,

      })
    } catch (error: any) {
      console.error('Error getAllClass:', error)
      return ResponseData.serverError(res, error)
    }
  },

  
  getClassById: async (req: Request, res: Response): Promise<any> => {
    try {
      const classId = parseInt(req.params.id as string)
      const masterClass = await prisma.masterClass.findUnique({
        where: { id: classId },
      })

      if (!masterClass) {
        return ResponseData.notFound(res, 'Class not found')
      }

      return ResponseData.ok(res, masterClass, 'Success get class by id')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },

  createMasterCLass: async (req: Request, res: Response) => {
    try {
      const { grup, kelas } = req.body

      if (!grup || !kelas) {
        return ResponseData.badRequest(res, 'Missing required fields')
      }

      const newMasterClass= await prisma.masterClass.create({
        data: {
          grup,   
          kelas, 
        },
      })

      return ResponseData.created(res, newMasterClass, 'Class created successfully')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },


  updateMasterCLass: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return ResponseData.badRequest(res, 'Invalid ID')

      const existing = await prisma.masterClass.findUnique({ where: { id } })
      if (!existing) {
        return ResponseData.notFound(res, 'Class not found')
      }

      const { kelas, grup } = req.body

      const updated = await prisma.masterClass.update({
        where: { id },
        data: { kelas, grup },
      })

      return ResponseData.ok(res, updated, 'Class updated successfully')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },


  deleteMasterClass: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return ResponseData.badRequest(res, 'Invalid ID')

      const existing = await prisma.masterClass.findUnique({ where: { id } })
      if (!existing) {
        return ResponseData.notFound(res, 'Class not found')
      }


      const deleted = await prisma.masterClass.update({
        where: { id },
        data: { deleteAt: new Date() },
      })

      return ResponseData.ok(res, deleted, 'Class deleted successfully')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },
}
export default MasterClassController