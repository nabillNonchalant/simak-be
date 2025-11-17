import prisma from '@/config/database'
import { Pagination } from '@/utilities/Pagination'

export const getRekapanGuruService = async (page: Pagination, id?: number) => {

  const whereCondition: any = {
    deletedAt: null,
    roleId: 3,
  }

  // Jika ada filter ID → tambahkan ke where
  if (id) {
    whereCondition.id = id
  }

  const [guruList, count] = await Promise.all([
    prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        email: true,
        gender: true,
        nipNisn: true,
        absensiGuru: {
          select: {
            status: true,
            createdAt: true,
          },
        },
      },
      skip: page.offset,
      take: page.limit,
      orderBy: { id: 'desc' },
    }),

    prisma.user.count({
      where: whereCondition,
    }),
  ])

  const formatted = guruList.map((guru: any) => {
    const summary = {
      hadir: guru.absensiGuru.filter((a: any) => a.status === 'HADIR').length,
      izin: guru.absensiGuru.filter((a: any) => a.status === 'IZIN').length,
      sakit: guru.absensiGuru.filter((a: any) => a.status === 'SAKIT').length,
      alfa: guru.absensiGuru.filter((a: any) => a.status === 'ALFA').length,
    }

    return {
      id: guru.id,
      name: guru.name,
      email: guru.email,
      gender: guru.gender,
      nipNisn: guru.nipNisn,
      statistik: summary,
    }
  })

  return {
    count,
    rows: formatted,
  }
}
