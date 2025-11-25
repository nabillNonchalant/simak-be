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
    const classId = req.query.classId ? Number(req.query.classId) : undefined
    const grup = req.query.grup ? String(req.query.grup) : undefined

    const result = await getRekapanMuridService(page, id, classId, grup)

    const paginated = page.paginate({
      count: result.count,
      rows: result.rows,
    })

    return ResponseData.ok(
      res,
      {
        // total absensi global
        ...result.total,

        // sesuai struktur FE
        total_items: paginated.total_items,
        total_pages: paginated.total_pages,
        current_page: paginated.current_page,
        limit: paginated.limit,
        items: paginated.items, // <-- FE baca dari sini

        links: {
          prev: paginated.current_page > 1 ? paginated.current_page - 1 : null,
          next: paginated.current_page < paginated.total_pages ? paginated.current_page + 1 : null,
        },
      },
      'Success get all rekapan murid',
    )
  } catch (error: any) {
    return ResponseData.serverError(res, error)
  }
}
