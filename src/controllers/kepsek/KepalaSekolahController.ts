import { Request, Response } from 'express'
import prisma from '../../config/database'
import { logActivity } from '../../utilities/LogActivity'
import { ResponseData } from '../../utilities/Response'
import { jwtPayloadInterface } from '../../types/jwtpayloadinterface'

const KepalaSekolahController = {
  getPendingUsers: async (req: Request, res: Response) => {
    const userLogin = req.user as jwtPayloadInterface

    if (userLogin.roleType !== 'KEPALA_SEKOLAH') {
      return ResponseData.unauthorized(res, 'Hanya Kepala Sekolah yang dapat mengakses ini')
    }

    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 10
      const skip = (page - 1) * limit

      const [pendingUsers, total] = await Promise.all([
        prisma.user.findMany({
          where: {
            status: 'menunggu',
            role: {
              roleType: 'GURU',
            },
          },
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
            email: true,
            role: { select: { name: true, roleType: true } },
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({
          where: {
            status: 'menunggu',
            role: {
              roleType: 'GURU',
            },
          },
        }),
      ])

      return ResponseData.ok(res,
        {
          rows: pendingUsers,
          total,
          page,
          totalPage: Math.ceil(total / limit),
        },
        'Daftar guru menunggu verifikasi',
      )

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
        data: { status: 'setujui' },
        include: { role: true },
      })

      const notification = await prisma.notification.create({
        data: {
          type: 'ACCOUNT_APPROVAL',
          title: 'Akun Disetujui',
          message: 'Selamat! Akun Anda telah diverifikasi oleh Kepala Sekolah.',
        },
      })

      // Simpan notifikasi ke user penerima
      await prisma.notificationUser.create({
        data: {
          userId: user.id,
          notificationId: notification.id, // WAJIB !
          title: notification.title,
          message: notification.message,
          deliveredAt: new Date(),
        },
      })

      await logActivity(userLogin.id, 'UPDATE', `Menyetujui akun ${user.email}`)

      return ResponseData.ok(res, user, 'Akun berhasil diverifikasi')

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
