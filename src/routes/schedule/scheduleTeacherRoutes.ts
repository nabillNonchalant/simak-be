import ScheduleTeacherController from '@/controllers/schedule/ScheduleTeacherController'
import { Router } from 'express'

export const ScheduleTeacherRouter = (): Router => {
  const router = Router()

  router.get('/',ScheduleTeacherController.getJadwalGuru)
  router.get('/:id', ScheduleTeacherController.getJadwalGuruById)
  router.post('/create', ScheduleTeacherController.createJadwalGuru)
  router.put('/update/:id',ScheduleTeacherController.updateJadwalGuru)
  router.delete('/:id/delete  ', ScheduleTeacherController.deleteJadwalGuru)

  return router
}
