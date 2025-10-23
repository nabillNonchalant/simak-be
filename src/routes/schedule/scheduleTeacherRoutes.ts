import { Router } from 'express'
import ScheduleTeacherController from '@/controllers/schedule/ScheduleTeacherController'

export const ScheduleTeacherRouter = (): Router => {
  const router = Router()

  router.get('/', ScheduleTeacherController.getAllJadwal)              // ✅ ambil semua jadwal
  router.get('/:id', ScheduleTeacherController.getJadwalGuruById)      // ✅ ambil jadwal berdasarkan id
  router.post('/create', ScheduleTeacherController.createJadwalGuru)
  router.put('/update/:id', ScheduleTeacherController.updateJadwalGuru)
  router.delete('/delete/:id', ScheduleTeacherController.deleteJadwalGuru)

  return router
}
