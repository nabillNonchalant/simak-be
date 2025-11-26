import prisma from '@/config/database'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'

const ResetPasswordController = {
  resetPassword: async (req: Request, res: Response) => {
    const { resetToken, newPassword, confirmPassword } = req.body

    try {
      if (!resetToken || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'Lengkapi semua field' })
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Password tidak sama' })
      }

      const tokenRecord = await prisma.passwordResetToken.findFirst({
        where: { token: resetToken },
      })

      if (!tokenRecord) {
        return res.status(400).json({ message: 'Token reset tidak valid' })
      }

      if (tokenRecord.expiredAt < new Date()) {
        return res.status(400).json({ message: 'Token reset sudah kadaluwarsa' })
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)

      await prisma.user.update({
        where: { email: tokenRecord.email },
        data: { password: hashedPassword },
      })

      // Hapus token setelah digunakan
      await prisma.passwordResetToken.delete({
        where: { id: tokenRecord.id },
      })

      return res.json({ message: 'Password berhasil direset' })
    } catch (error) {
      console.error('[RESET PASSWORD ERROR]:', error)
      return res.status(500).json({ message: 'Server error' })
    }
  },
}

export default ResetPasswordController
