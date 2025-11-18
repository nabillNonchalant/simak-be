import prisma from '@/config/database'
import { Pagination } from '@/utilities/Pagination'

export const getRekapanMuridService = async (page: Pagination, id?: number) => {
  const where: any = {
    role: {
      roleType: 'OTHER',
    },
  }

  if (id) where.id = id

  const count = await prisma.user.count({ where })


  const muridList = await prisma.user.findMany({
    where,
    skip: page.offset,
    take: page.limit,
    orderBy: { id: 'desc' },
    include: {
      absensiMurid: true,
    },
  })

  const formatted = muridList.map((m: any) => {
    const absensi = m.absensiMurid

    const summary = {
      hadir: absensi.filter((a: any) => a.status === 'HADIR').length,
      izin: absensi.filter((a: any) => a.status === 'IZIN').length,
      sakit: absensi.filter((a: any) => a.status === 'SAKIT').length,
      alfa: absensi.filter((a: any) => a.status === 'ALFA').length,
    }

    return {
      id: m.id,
      name: m.name,
      gender: m.gender,
      nipNisn: m.nipNisn,
      nomerTelepon: m.nomerTelepon,
      tanggalLahir: m.tanggalLahir,
      status: m.status,
      statistik: summary,
    }
  })

  const total = {
    totalMuridHadir: 0,
    totalMuridIzin: 0,
    totalMuridSakit: 0,
    totalMuridAlfa: 0,
  }

  formatted.forEach((m: any) => {
    total.totalMuridHadir += m.statistik.hadir
    total.totalMuridIzin += m.statistik.izin
    total.totalMuridSakit += m.statistik.sakit
    total.totalMuridAlfa += m.statistik.alfa
  })

  return {
    count,
    rows: formatted,
    total,
  }
}
