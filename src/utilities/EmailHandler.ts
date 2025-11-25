import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

export const sendEmail = async (to: string, subject: string, text: string, OTP?: any, Anda?: any, $?: any, p0?: { otp: string }) => {
  try {
    const info = await transporter.sendMail({
      from: `"SIMAK" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
    })

    console.log('📨 Email berhasil dikirim:', info.messageId)
    return true
  } catch (error) {
    console.error('❌ Error kirim email:', error)
    throw new Error('Gagal mengirim email')
  }
}
