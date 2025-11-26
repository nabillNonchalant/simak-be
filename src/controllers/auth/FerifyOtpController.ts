import prisma from '@/config/database'
import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

const VerifyOtpController = {
  verifyOtp: async (req: Request, res: Response) => {
    const { email, otp } = req.body

    try {
      if (!email || !otp) {
        return res.status(400).json({ message: 'Email dan OTP wajib diisi' })
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

      // Buat token sementara untuk reset password
      const resetToken = uuidv4()

      await prisma.passwordResetToken.create({
        data: {
          email,
          token: resetToken,
          expiredAt: new Date(Date.now() + 10 * 60 * 1000), // berlaku 10 menit
        },
      })

      // Hapus OTP setelah dipakai
      await prisma.otp.delete({ where: { id: otpRecord.id } })

      return res.json({
        message: 'OTP valid',
        resetToken,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Server error' })
    }
  },
}

export default VerifyOtpController
