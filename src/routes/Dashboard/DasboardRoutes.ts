import { Router } from 'express'
import { getDashboard } from '@/controllers/Dashboard/DashboardController'
//import { verifyToken } from '@/middlewares/AuthMiddleware'

const router = Router()

router.get('/dashboard', getDashboard)

export default router
