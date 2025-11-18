import { Router } from 'express'
import { getAllRekapanMuridController } from '@/controllers/RekapanMurid/RekapanMuridController'

const router = Router()

router.get('/murid', getAllRekapanMuridController)

export default router

