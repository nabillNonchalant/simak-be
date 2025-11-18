import { Request, Response } from 'express'
import { Pagination } from '@/utilities/Pagination'
import { ResponseData } from '@/utilities/Response'
import { getRekapanMuridService } from '@/services/MuridService/MuridService'


export const getAllRekapanMuridController = async (req: Request, res: Response) => {
  try {
    const page = new Pagination(
      Number(req.query.page),
      Number(req.query.limit),
    )


    const id = req.query.id ? Number(req.query.id) : undefined


    const result = await getRekapanMuridService(page, id)

    return ResponseData.ok(
      res,
      page.paginate(result),
      'Success get all rekapan murid',
    )

  } catch (error: any) {
    return ResponseData.serverError(res, error)
  }
}