import { Router } from 'express'
import { getAllRekapanGuruController } from '@/controllers/RekapanGuru/RekapanGuruController'

const router = Router()

router.get('/guru', getAllRekapanGuruController)

export default router
