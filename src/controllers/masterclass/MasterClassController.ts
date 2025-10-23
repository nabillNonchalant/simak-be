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
  getAllClass : async (req: Request, res: Response): Promise<any> => {
    try {
      const page = new Pagination(
        parseInt(req.query.page as string),
        parseInt(req.query.limit as string),
      )

      const userLogin = req.user

      console.log(userLogin?.role)

      const whereCondition = {
        deletedAt: null,
      }

      const [userData, count] = await Promise.all([
        prisma.user.findMany({
          where: whereCondition,
          include: {
            jadwalGuru: true,
          },
          skip: page.offset,
          take: page.limit,
          orderBy: { id: 'desc' },
        }),
        prisma.user.count({
          where: whereCondition,
        }),
      ])

      return ResponseData.ok(
        res,
        page.paginate({
          count,
          rows: userData,
        }),
        'Success get all ',
      )
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },
  
  getClassById: async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = parseInt(req.params.id as string)
      const userData = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!userData) {
        return ResponseData.notFound(res, 'Class not found')
      }

      return ResponseData.ok(res, userData, 'Success get class by id')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },

  createClass: async (req: Request, res: Response): Promise<any> => {
    try {
      const reqBody = req.body
      const userLogin = req.user as jwtPayloadInterface

      const validationResult = validateInput(UserSchemaForCreate, reqBody)

      if (!validationResult.success) {
        return ResponseData.badRequest(res, 'Invalid Input', validationResult.errors)
      }

      const cekRole = await prisma.role.findUnique({
        where: { id: reqBody.classId },
      })
      if (!cekRole) {
        return ResponseData.badRequest(res, 'class not found')
      }

      const userData = await prisma.user.create({
        data: validationResult.data!,
      })

      // soket create user
      getIO().emit('create-class', userData)

      // loger create user wajib untuk setiap create 
      await logActivity(userLogin.id, 'CREATE', `Create class ${userData.name}`)

      return ResponseData.created(res, userData, 'Success')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },

  updateClass: async (req: Request, res: Response): Promise<any> => {
    const reqBody = req.body

    const validationResult = validateInput(UserSchemaForUpdate, reqBody)

    if (!validationResult.success) {
      return ResponseData.badRequest(res, 'Invalid Input', validationResult.errors)
    }
    try {

      const masterClass = await prisma.masterClass.findUnique({
        where: { id: reqBody.classId },
      })

      if (!masterClass) {
        return ResponseData.notFound(res, 'Class not found')
      }

      const updatedUserData = await prisma.user.update({
        where: { id: reqBody.classId },
        data: validationResult.data!,
      })

      const userLogin = req.user as jwtPayloadInterface
      await logActivity(userLogin.id, 'UPDATE', `update Class ${masterClass.kelas}`)
      await redisClient.del(`class_permissions:${masterClass.id}`)

      return ResponseData.ok(res, updatedUserData, 'Success')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },

  deleteclass: async (req: Request, res: Response): Promise<any> => {
    try {
      const classId = parseInt(req.params.id as string)

      const userData = await prisma.user.findUnique({
        where: { id: classId },
      })

      if (!userData) {
        return ResponseData.notFound(res, 'class not found')
      }
      

      await prisma.user.delete({
        where: { id: classId },
      })

      const userLogin = req.user as jwtPayloadInterface
      await logActivity(userLogin.id, 'DELETE', `delete class ${userData.name}`)

      return ResponseData.ok(res, 'Success')
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },
}

export default MasterClassController