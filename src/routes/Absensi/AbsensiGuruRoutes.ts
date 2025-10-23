import AbsensiGuruController from '@/controllers/absensi/AbsensiGuruController'
import { Router } from 'express'

export const AbsensiGuruRouter = (): Router => {
  const router = Router()

  router.get('/', AbsensiGuruController.getAllAbsensiguru)
  router.get('/:id', AbsensiGuruController.getAbsensiGuruById)
  router.post('/create', AbsensiGuruController.createAbsensiGuru)
  router.put('/update/:id', AbsensiGuruController.updateAbsensiGuru)
  router.delete('/:id/delete', AbsensiGuruController.deleteAbsensiGuru)

  return router
  
}