import AbsensiMuridController from '@/controllers/absensi/AbsensiMuridController'
import { Router } from 'express'

export const AbsensiMuridRouter = (): Router => {
  const router = Router()

  router.get('/',AbsensiMuridController.getAllAbsensiMurid)
  router.get('/:id', AbsensiMuridController.getAbsensiMuridById)
  router.post('/create',AbsensiMuridController.createAbsensiMurid)
  router.put('/update/:id',AbsensiMuridController.updateAbsensiMurid)
  router.delete('/:id/delete', AbsensiMuridController.deleteAbsensiMurid)

  return router
}