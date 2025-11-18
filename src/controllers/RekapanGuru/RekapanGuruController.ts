import { Request, Response } from 'express'
import { getRekapanGuruService } from '@/services/GuruService/GuruService'
import { Pagination } from '@/utilities/Pagination'
import { ResponseData } from '@/utilities/Response'

export const getAllRekapanGuruController = async (req: Request, res: Response) => {
  try {
    const page = new Pagination(
      Number(req.query.page),
      Number(req.query.limit),
    )

    const id = req.query.id ? Number(req.query.id) : undefined

    const result = await getRekapanGuruService(page, id)

    const paginated = page.paginate({
      count: result.count,
      rows: result.rows,
    })

    return ResponseData.ok(
      res,
      {
        totalGuruHadir: result.totalGuruHadir,
        totalGuruIzin: result.totalGuruIzin,
        totalGuruSakit: result.totalGuruSakit,
        totalGuruAlfa: result.totalGuruAlfa,
        ...paginated,
        total: result.total,
      },
      'Success get all rekapan guru',
    )

  } catch (error: any) {
    return ResponseData.serverError(res, error)
  }
}
