import { Router } from 'express'
import ScheduleTeacherController from '@/controllers/schedule/ScheduleTeacherController'

export const ScheduleTeacherRouter = (): Router => {
  const router = Router()

  router.get('/', ScheduleTeacherController.getAllJadwal)              
  router.get('/:id', ScheduleTeacherController.getJadwalGuruById)      
  router.post('/create', ScheduleTeacherController.createJadwalGuru)
  router.put('/update/:id', ScheduleTeacherController.updateJadwalGuru)
  router.delete('/delete/:id', ScheduleTeacherController.deleteJadwalGuru)

  return router
}
