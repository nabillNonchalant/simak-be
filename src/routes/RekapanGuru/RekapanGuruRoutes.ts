import { Router } from 'express'
import { getRekapanGuru } from '@/controllers/RekapanGuru/RekapanGuruController'

const router = Router()

router.get('/guru/:id', getRekapanGuru)

export default router
