import prisma from '@/config/database'
import { Pagination } from '@/utilities/Pagination'

export const getRekapanGuruService = async (page: Pagination, id?: number) => {
  const where: any = {
    role: { roleType: 'GURU' },
  }

  if (id) where.id = id

  const count = await prisma.user.count({ where })

  const guruList = await prisma.user.findMany({
    where,
    skip: page.skip ?? (page.page ? (page.page - 1) * page.limit : 0),
    take: page.limit,
    orderBy: { id: 'desc' },
    include: {
      jadwalGuru: {
        include: {
          absensiGuru: true,
        },
      },
    },
  })

  const formatted = guruList.map((guru: any) => {
    const allAbsensi = guru.jadwalGuru.flatMap((j: any) => j.absensiGuru)

    const summary = {
      hadir: allAbsensi.filter((a: any) => a.status === 'HADIR').length,
      izin: allAbsensi.filter((a: any) => a.status === 'IZIN').length,
      sakit: allAbsensi.filter((a: any) => a.status === 'SAKIT').length,
      alfa: allAbsensi.filter((a: any) => a.status === 'ALFA').length,
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
