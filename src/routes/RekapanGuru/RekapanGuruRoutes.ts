import { Router } from 'express'
import { getRekapanGuru } from '@/controllers/RekapanGuru/RekapanGuruController'

const router = Router()

router.get('/guru', getRekapanGuru)

export default router
