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
    skip: page.offset,
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

  const totalSummary = {
    hadir: 0,
    izin: 0,
    sakit: 0,
    alfa: 0,
  }

  formatted.forEach((g: any) => {
    totalSummary.hadir += g.statistik.hadir
    totalSummary.izin += g.statistik.izin
    totalSummary.sakit += g.statistik.sakit
    totalSummary.alfa += g.statistik.alfa
  })

  const [
    totalGuruHadir,
    totalGuruIzin,
    totalGuruSakit,
    totalGuruAlfa,
  ] = await Promise.all([
    prisma.absensiGuru.count({ where: { status: 'HADIR' } }),
    prisma.absensiGuru.count({ where: { status: 'IZIN' } }),
    prisma.absensiGuru.count({ where: { status: 'SAKIT' } }),
    prisma.absensiGuru.count({ where: { status: 'ALFA' } }),
  ])


  return {

    totalGuruHadir,
    totalGuruIzin,
    totalGuruSakit,
    totalGuruAlfa,

    count,
    rows: formatted,
    total: totalSummary,
  }
}
