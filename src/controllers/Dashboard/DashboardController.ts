import { Request, Response } from 'express'
import prisma from '../../config/database'
import { RoleType, StatusAbsensi } from '@prisma/client'

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const totalSiswaSiswi = await prisma.user.count({
      where: {
        role: { roleType: RoleType.OTHER },
      },
    })

    const totalSiswa = await prisma.user.count({
      where: {
        gender: 'L',
        role: { roleType: RoleType.OTHER },
      },
    })

    const totalSiswi = await prisma.user.count({
      where: {
        gender: 'P',
        role: { roleType: RoleType.OTHER },
      },
    })

    const totalGuru = await prisma.user.count({
      where: {
        role: { roleType: RoleType.GURU },
      },
    })

    const days = Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() - (6 - idx))
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    })

    const earliest = new Date(days[0] + 'T00:00:00.000Z')
    const latest = new Date(days[6] + 'T23:59:59.999Z')

    const absensi = await prisma.absensiMurid.findMany({
      where: {
        createdAt: { gte: earliest, lte: latest },
      },
      select: {
        status: true,
        createdAt: true,
      },
    })

    const chart = days.map((day) => {
      const hadir = absensi.filter((r) => {
        const tgl = r.createdAt.toISOString().slice(0, 10)
        return tgl === day && r.status === StatusAbsensi.HADIR
      }).length

      const izin = absensi.filter((r) => {
        const tgl = r.createdAt.toISOString().slice(0, 10)
        return tgl === day && r.status === StatusAbsensi.IZIN
      }).length

      return {
        date: day,
        hadir,
        izin,
      }
    })


    return res.json({
      totalSiswaSiswi,
      totalSiswa,
      totalSiswi,
      totalGuru,
      chart,
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
