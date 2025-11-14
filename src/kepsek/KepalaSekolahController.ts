import { Request, Response } from 'express'
import prisma from '../config/database'
import { logActivity } from '../utilities/LogActivity'
import { ResponseData } from '../utilities/Response'
import { jwtPayloadInterface } from '../types/jwtpayloadinterface'

const KepalaSekolahController = {
  getPendingUsers: async (req: Request, res: Response) => {
    const userLogin = req.user as jwtPayloadInterface

    if (userLogin.roleType !== 'KEPALA_SEKOLAH') {
      return ResponseData.unauthorized(res, 'Hanya Kepala Sekolah yang dapat mengakses ini')
    }

    try {
      const pendingUsers = await prisma.user.findMany({
        where: { status: 'menunggu' },
        select: {
          id: true,
          name: true,
          email: true,
          role: { select: { name: true } },
          createdAt: true,
        },
      })

      return ResponseData.ok(res, pendingUsers, 'login menunggu verifikasi')
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },

  approveUser: async (req: Request, res: Response) => {
    const userLogin = req.user as jwtPayloadInterface
    const { userId } = req.params

    if (userLogin.roleType !== 'KEPALA_SEKOLAH') {
      return ResponseData.unauthorized(res, 'Hanya Kepala Sekolah yang dapat menyetujui akun')
    }

    try {
      const user = await prisma.user.update({
        where: { id: Number(userId) },
        data: { status: 'disetujui' },
      })

      await logActivity(userLogin.id, 'UPDATE', `Menyetujui akun ${user.email}`)
      return ResponseData.ok(res, user, 'Akun berhasil diferivikasi')
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },

  rejectUser: async (req: Request, res: Response) => {
    const userLogin = req.user as jwtPayloadInterface
    const { userId } = req.params

    if (userLogin.roleType !== 'KEPALA_SEKOLAH') {
      return ResponseData.unauthorized(res, 'Hanya Kepala Sekolah yang dapat menolak akun')
    }

    try {
      const user = await prisma.user.update({
        where: { id: Number(userId) },
        data: { status: 'ditolak' },
      })

      await logActivity(userLogin.id, 'UPDATE', `Menolak akun ${user.email}`)
      return ResponseData.ok(res, user, 'Akun berhasil ditolak')
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },
}

export default KepalaSekolahController
