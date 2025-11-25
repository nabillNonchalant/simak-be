import prisma from '@/config/database'
import { Pagination } from '@/utilities/Pagination'

export const getRekapanMuridService = async (
  page: Pagination,
  id?: number,
  classId?: number,
  grup?: string,
) => {
  const where: any = {
    role: {
      roleType: 'OTHER',
    },
    deletedAt: null,
  }

  if (id) where.id = id
  if (classId) where.classId = classId

  if (grup) {
    where.kelas = {
      grup: {
        contains: grup,
        mode: 'insensitive',
      },
    }
  }

  const count = await prisma.user.count({
    where,
  })

  const muridList = await prisma.user.findMany({
    where,
    skip: page.offset,
    take: page.limit,
    orderBy: { id: 'desc' },
    include: {
      kelas: true,
      absensiMurid: {
        where: {
          deleteAt: null,
        },
      },
    },
  })

  const formatted = muridList.map((m: any) => {
    const absensi = m.absensiMurid ?? []
    return {
      id: m.id,
      name: m.name,
      gender: m.gender,
      nipNisn: m.nipNisn,
      nomerTelepon: m.nomerTelepon,
      tanggalLahir: m.tanggalLahir,
      status: m.status,
      kelas: m.kelas
        ? {
          id: m.kelas.id,
          kelas: m.kelas.kelas,
          grup: m.kelas.grup,
        }
        : null,
      statistik: {
        hadir: absensi.filter((a: any) => a.status === 'HADIR').length,
        izin: absensi.filter((a: any) => a.status === 'IZIN').length,
        sakit: absensi.filter((a: any) => a.status === 'SAKIT').length,
        alfa: absensi.filter((a: any) => a.status === 'ALFA').length,
      },
    }

  })

  const total = {
    totalMuridHadir: formatted.reduce((s: number, m: any) => s + m.statistik.hadir, 0),
    totalMuridIzin: formatted.reduce((s: number, m: any) => s + m.statistik.izin, 0),
    totalMuridSakit: formatted.reduce((s: number, m: any) => s + m.statistik.sakit, 0),
    totalMuridAlfa: formatted.reduce((s: number, m: any) => s + m.statistik.alfa, 0),
  }

  return { count, rows: formatted, total }
}
