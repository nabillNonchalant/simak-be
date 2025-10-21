import StudentScheduleController from '@/controllers/schedule/StudentScheduleController'
import { Router } from 'express'

export const StudentScheduleRouter = (): Router => {
  const router = Router() 

  router.get('/',StudentScheduleController.getJadwalMurid)
  router.get('/:id', StudentScheduleController.getJadwalMuridById)
  router.post('/create', StudentScheduleController.createJadwalMurid)
  router.put('/update/:id',StudentScheduleController.updateJadwalMurid)
  router.delete('/:id/delete', StudentScheduleController.deleteJadwalMurid)

  return router

}