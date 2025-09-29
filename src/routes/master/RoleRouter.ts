import RoleController from '@/controllers/master/RoleController'
import { Router } from 'express'

export const RoleRouter = () : Router => {
  const router = Router()

  router.get('/permissions', RoleController.getAllPermission)
  router.get('/role', RoleController.getAllRole)
  router.get('/:roleId', RoleController.getRoleById)
  router.post('/create', RoleController.createRole)
  router.put('/:updateRole', RoleController.updateRole)
  router.delete('/:roleId', RoleController.deleteRole)


  return router
}