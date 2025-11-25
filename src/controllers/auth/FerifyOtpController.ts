import prisma from '@/config/database'
import { Request, Response } from 'express'

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

      return res.json({ message: 'OTP valid, silakan reset password' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Server error' })
    }
  },
}

export default VerifyOtpController
