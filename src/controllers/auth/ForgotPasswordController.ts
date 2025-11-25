import prisma from '../../config/database'
import { Request, Response } from 'express'
import { sendEmail } from '@/utilities/EmailHandler'

const ForgotPasswordController = {
  forgotPassword: async (req: Request, res: Response) => {
    const { email } = req.body

    try {
      if (!email) {
        return res.status(400).json({ message: 'Email wajib diisi' })
      }

      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) return res.status(404).json({ message: 'Email tidak terdaftar' })

      // Hapus OTP lama (penting!)
      await prisma.otp.deleteMany({
        where: { email },
      })

      // Generate OTP 6 digit
      const otp = Math.floor(100000 + Math.random() * 900000).toString()

      // Simpan OTP baru
      await prisma.otp.create({
        data: {
          email,
          otp,
          expiredAt: new Date(Date.now() + 5 * 60 * 1000), // 5 menit
        },
      })

      // Kirim email
      await sendEmail(email, 'Reset Password', `Kode OTP Anda: ${otp}`)

      console.log('OTP:', otp)

      return res.json({ message: 'OTP terkirim ke email anda' })

    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Server error' })
    }
  },
}

export default ForgotPasswordController
