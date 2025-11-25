import prisma from '@/config/database'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'

const ResetPasswordController = {
  resetPassword: async (req: Request, res: Response) => {
    const { resetToken, newPassword } = req.body

    try {
      if (!resetToken || !newPassword) {
        return res.status(400).json({ message: 'Lengkapi semua field' })
      }

      const otpRecord = await prisma.otp.findFirst({
        where: { otp: resetToken },
      })

      if (!otpRecord) {
        return res.status(400).json({ message: 'Token reset tidak valid' })
      }

      if (otpRecord.expiredAt < new Date()) {
        return res.status(400).json({ message: 'Token kadaluwarsa' })
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)

      await prisma.user.update({
        where: { email: otpRecord.email },
        data: { password: hashedPassword },
      })

      await prisma.otp.delete({
        where: { id: otpRecord.id },
      })

      return res.json({ message: 'Password berhasil direset' })
    } catch (error) {
      console.error('[RESET PASSWORD ERROR]:', error)
      return res.status(500).json({ message: 'Server error' })
    }
  },
}

export default ResetPasswordController
