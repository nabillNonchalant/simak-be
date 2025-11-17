import { Request, Response } from 'express'
import { Pagination } from '@/utilities/Pagination'
import { ResponseData } from '@/utilities/Response'
import { getRekapanGuruService } from '@/services/GuruService/GuruService'

export const getAllRekapanGuruController = async (req: Request, res: Response) => {
  try {
    const page = new Pagination(
      Number(req.query.page),
      Number(req.query.limit),
    )

    // Ambil filter id jika ada
    const id = req.query.id ? Number(req.query.id) : undefined

    // Kirim 2 parameter (page, id)
    const result = await getRekapanGuruService(page, id)

    return ResponseData.ok(
      res,
      page.paginate(result),
      'Success get all rekapan guru',
    )

  } catch (error: any) {
    return ResponseData.serverError(res, error)
  }
}
