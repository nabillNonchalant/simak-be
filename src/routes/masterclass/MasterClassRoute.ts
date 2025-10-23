import MasterClassController from '@/controllers/masterclass/MasterClassController'
import { Router } from 'express'

export const AbsensiMuridRouter = (): Router => {
  const router = Router()

  router.get('/',MasterClassController.getAllClass)
  router.get('/:id', MasterClassController.getClassById)
  router.post('/create',MasterClassController.createClass)
  router.put('/update/:id',MasterClassController.updateClass)
  router.delete('/:id/delete', MasterClassController.deleteclass)

  return router
}