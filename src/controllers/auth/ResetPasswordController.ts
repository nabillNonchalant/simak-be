import prisma from '@/config/database'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'

const ResetPasswordController = {
  resetPassword: async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body

    try {
      if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: 'Lengkapi semua field' })
      }

      const otpRecord = await prisma.otp.findFirst({
        where: { email, otp },
      })

      if (!otpRecord) {
        return res.status(400).json({ message: 'OTP salah' })
      }

      if (otpRecord.expiredAt < new Date()) {
        return res.status(400).json({ message: 'OTP kadaluwarsa' })
      }

      const hashed = await bcrypt.hash(newPassword, 10)

      await prisma.user.update({
        where: { email },
        data: { password: hashed },
      })

      // Hapus OTP setelah digunakan
      await prisma.otp.delete({
        where: { id: otpRecord.id },
      })

      return res.json({ message: 'Password berhasil direset' })
      
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Server error' })
    }
  },
}

export default ResetPasswordController
