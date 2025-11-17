import UserController from '@/controllers/master/UserController'
import { Router } from 'express'

export const UserRouter = (): Router => {
  const router = Router()

  router.get('/', UserController.getAllUser)
  router.get('/:id', UserController.getUserById)
  router.post('/create', UserController.createUser)
  router.put('/update/:id', UserController.updateUser)
  router.delete('/:id/soft', UserController.softDeleteUser)
  router.patch('/:id/restore', UserController.restoreUser)
  router.delete('/:id/hard', UserController.deleteUser)
  router.patch('/:id/status', UserController.updateStatus)

  return router
}
