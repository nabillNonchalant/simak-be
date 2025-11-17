import prisma from '@/config/database'

export const getRekapanGuruService = async (userId: number, mapel?: string) => {

  const whereCondition: any = { deleteAt: null }

  if(userId){
    whereCondition.id = Number(userId)
  }

  const guru = await prisma.user.findUnique({
    where: whereCondition,
    select: {
      id: true,
      name: true,
      email: true,
      gender: true,
      nipNisn: true,
    },
  })

  if (!guru) {
    return { notFound: true }
  }

  const summary = await prisma.absensiGuru.groupBy({
    by: ['status'],
    _count: { status: true },
    where: {
      userId,
      deleteAt: null,
      jadwalGuru: {
        mataPelajaran: mapel || undefined,
      },
    },
  })

  const formatSummary = {
    hadir: summary.find(s => s.status === 'HADIR')?._count.status || 0,
    izin: summary.find(s => s.status === 'IZIN')?._count.status || 0,
    sakit: summary.find(s => s.status === 'SAKIT')?._count.status || 0,
    alfa: summary.find(s => s.status === 'ALFA')?._count.status || 0,
  }

  return {
    guru,
    statistik: formatSummary,
  }
}
