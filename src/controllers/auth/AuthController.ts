import { Request, Response } from 'express'
import { validateInput } from '../../utilities/ValidateHandler'
import { LoginSchema, RegisterSchema } from '../../schema/UserSchema'
import prisma from '../../config/database'
import { comparePassword, hashPassword } from '../../utilities/PasswordHandler'
import { generateAccesToken } from '../../utilities/JwtHanldler'
import { CONFIG } from '../../config'
import { logActivity } from '../../utilities/LogActivity'
import { ResponseData } from '@/utilities/Response'

const AuthController = {
  register : async (req: Request, res: Response) => {
    const reqBody = req.body
      
    const validationResult = validateInput(RegisterSchema, reqBody)
      
    if (!validationResult.success) {
      return ResponseData.badRequest(res, 'Invalid Input', validationResult.errors)
    }
    try {

      const cekExistingRole = await prisma.role.findFirst({
        where: { name: 'Guru' },
      })

      if (!cekExistingRole) {
        return ResponseData.badRequest(res, 'Role not found')
      }


      const cekEmail = await prisma.user.findFirst({
        where: {  
          email: reqBody.email,
        },
      })

      if(cekEmail){
        return ResponseData.badRequest(res, 'Email sudah digunakan')

      }

      const cekNomerTelepon = await prisma.user.findFirst({
        where: {
          nomerTelepon: reqBody.nomerTelepon,
        },
      })

      if(cekNomerTelepon){
        return ResponseData.badRequest(res, 'Nomer Telepon sudah digunakan')
      }
      
      reqBody.password = await hashPassword(reqBody.password)

      const userData = await prisma.user.create({
        data: {
          name: reqBody.name,
          email: reqBody.email,
          nomerTelepon: reqBody.nomerTelepon,
          tanggalLahir: new Date(reqBody.tanggalLahir),
          nipNisn:reqBody.nipNisn,
          password: reqBody.password,
          roleId: cekExistingRole.id,
        },
      })

      return ResponseData.created(res, userData, 'Success')
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },
  login : async (req: Request, res: Response) => {
    const reqBody = req.body

    const validationResult = validateInput(LoginSchema, reqBody)

    if (!validationResult.success) {
      return ResponseData.badRequest(res, 'Invalid Input', validationResult.errors)
    }

    try {
      const userData = await prisma.user.findUnique(
        {
          where: {
            email: reqBody.email,
          },
          include : { role : true },
        },
      )

      if (!userData) {
        return ResponseData.notFound(res, 'User not found')
      }

      const passwordMatch = await comparePassword(reqBody.password, userData.password as string)

      if (!passwordMatch) {
        return ResponseData.unauthorized(res, 'Password not match')
      }
      if (userData.role.roleType === 'GURU' && userData.status !== 'setujui') {
        return ResponseData.unauthorized(
          res,
          'Akun Anda belum diverifikasi oleh Kepala Sekolah. Silahkan tunggu persetujuan.',
        )
      }

      // test
      const tokenPayload = {
        id: userData.id,
        name: userData.name as string,
        role: userData.role.name,
        roleType: userData.role.roleType as 'SUPER_ADMIN' | 'OTHER' | 'GURU' | 'KEPALA_SEKOLAH',
        
      }

      const token = generateAccesToken(tokenPayload, CONFIG.secret.jwtSecret, 3600 * 24) // 1 day

      await prisma.session.create({
        data: {
          token: token,
          userId: userData.id,
        },
      })

      await logActivity(userData.id, 'LOGIN', 'User login')

      const responseData = {
        ...userData,
        token,
      }

      return ResponseData.ok(res, responseData, 'Success')

    } catch (error ) {
      return ResponseData.serverError(res, error)
    }
  },

  async getUserProfile(req: Request, res: Response): Promise<Response> {
    const userLogin = req.user as jwtPayloadInterface

    try {
      const userData = await prisma.user.findUnique({
        where: { id: userLogin.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: {
            select: {
              name: true,
              roleType: true,
              rolePermissions : {
                select : {
                  id : true,
                  canDelete: true,
                  canRead: true,
                  canRestore: true,
                  canUpdate: true,
                  canWrite: true,
                  permission : {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },

        },
      })

      if (!userData) {
        return ResponseData.notFound(res, 'User not found')
      }
      const mappedPermissions: string[] = []

      userData.role.rolePermissions.forEach((permission) => {
        if (permission.canRead) {
          mappedPermissions.push(`read:${permission.permission.name}`)
        }
        if (permission.canWrite) {
          mappedPermissions.push(`write:${permission.permission.name}`)
        }
        if (permission.canUpdate) {
          mappedPermissions.push(`update:${permission.permission.name}`)
        }
        if (permission.canRestore) {
          mappedPermissions.push(`restore:${permission.permission.name}`)
        }
        if (permission.canDelete) {
          mappedPermissions.push(`delete:${permission.permission.name}`)
        }
      })

      return ResponseData.ok(res, { ...userData,
        role: {
          ...userData.role,
          rolePermissions: mappedPermissions,
        },
      }, 'User profile retrieved successfully')

    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },
  
  logout : async (req: Request, res: Response) => {
    const userLogin = req.user as jwtPayloadInterface

    try {
      await prisma.session.deleteMany({
        where: {
          userId: userLogin.id,
        },
      })

      await logActivity(userLogin.id, 'LOGOUT', 'User logout')

      return ResponseData.ok(res, 'Success')

    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },


}


export default AuthController