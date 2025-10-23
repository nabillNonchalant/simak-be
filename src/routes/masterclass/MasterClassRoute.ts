import MasterClassController from '@/controllers/masterclass/MasterClassController'
import { Router } from 'express'

export const MasterClassRouter = (): Router => {
  const router = Router()

  router.get('/', MasterClassController.getAllClass)
  router.get('/:id', MasterClassController.getClassById)
  router.post('/create', MasterClassController.createMasterCLass)
  router.put('/update/:id', MasterClassController.updateMasterCLass)
  router.delete('/delete/:id', MasterClassController.deleteMasterClass)

  return router
}
