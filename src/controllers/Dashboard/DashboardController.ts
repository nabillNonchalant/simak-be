import { Request, Response } from 'express'
import prisma from '../../config/database'
import { RoleType, StatusAbsensi } from '@prisma/client'

export const getDashboard = async (req: Request, res: Response) => {
  try {
    // ==== COUNT DATA ====
    const [totalSiswaSiswi, totalSiswa, totalSiswi, totalGuru] = await Promise.all([
      prisma.user.count({ where: { role: { roleType: RoleType.OTHER } } }),
      prisma.user.count({ where: { gender: 'Laki-laki', role: { roleType: RoleType.OTHER } } }),
      prisma.user.count({ where: { gender: 'Perempuan', role: { roleType: RoleType.OTHER } } }),
      prisma.user.count({ where: { role: { roleType: RoleType.GURU } } }),
    ])

    // ==== TANGGAL 7 HARI TERAKHIR ====
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() - (6 - i))
      return d
    })

    const formattedDays = days.map(d =>
      d.toISOString().slice(0, 10),
    )

    const startDate = new Date(days[0])
    const endDate = new Date(days[6])
    endDate.setHours(23, 59, 59, 999)

    // ==== QUERY ABSENSI SEKALI SAJA ====
    const absensi = await prisma.absensiMurid.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      select: { status: true, createdAt: true },
    })

    // ==== GROUPING ====
    const grouped: Record<string, { hadir: number; izin: number }> = {}

    formattedDays.forEach(day => {
      grouped[day] = { hadir: 0, izin: 0 }
    })

    absensi.forEach(r => {
      const date = r.createdAt.toISOString().slice(0, 10)
      if (!grouped[date]) return

      if (r.status === StatusAbsensi.HADIR) grouped[date].hadir++
      if (r.status === StatusAbsensi.IZIN) grouped[date].izin++
    })

    const chart = formattedDays.map(day => ({
      date: day,
      hadir: grouped[day].hadir,
      izin: grouped[day].izin,
    }))

    return res.json({
      totalSiswaSiswi,
      totalSiswa,
      totalSiswi,
      totalGuru,
      chart,
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
