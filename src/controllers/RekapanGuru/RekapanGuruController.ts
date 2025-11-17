import { Request, Response } from 'express'
import { getRekapanGuruService } from '@/services/GuruService/GuruService'

export const getRekapanGuru = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.query.id)
    const mapel = req.query.mapel as string | undefined

    const result = await getRekapanGuruService(userId, mapel)

    if ('notFound' in result) {
      return res.status(404).json({ message: 'Guru tidak ditemukan' })
    }

    return res.status(200).json({
      status: true,
      message: 'Berhasil mengambil rekapan guru',
      data: result,
    })

  } catch (error) {
    console.log('Error getRekapanGuru:', error)
    return res.status(500).json({
      status: false,
      message: 'Terjadi kesalahan server',
      error,
    })
  }
}
