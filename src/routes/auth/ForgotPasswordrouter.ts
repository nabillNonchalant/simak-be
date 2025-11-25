import { Router } from 'express'
import ForgotPasswordController from '@/controllers/auth/ForgotPasswordController'
import VerifyOtpController from '@/controllers/auth/FerifyOtpController'
import ResetPasswordController from '@/controllers/auth/ResetPasswordController'

const router = Router()

router.post('/forgot', ForgotPasswordController.forgotPassword)
router.post('/otp', VerifyOtpController.verifyOtp)
router.post('/reset', ResetPasswordController.resetPassword)

export default router
