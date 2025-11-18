import prisma from '@/config/database'
import { Pagination } from '@/utilities/Pagination'

export const getRekapanMuridService = async (page: Pagination, id?: number) => {
  const where: any = {
    role: {
      roleType: 'OTHER', // murid = OTHER
    },
  }

  if (id) where.id = id

  // total data
  const count = await prisma.user.count({ where })

  // data rows
  const rows = await prisma.user.findMany({
    where,
    skip: (page as any).skip ?? ((page as any).page ? ((page as any).page - 1) * page.limit : 0),
    take: page.limit,
    select: {
      id: true,
      name: true,
      gender: true,
      nipNisn: true,
      nomerTelepon: true,
      tanggalLahir: true,
      status: true,
    },
  })

  return { count, rows }
}
