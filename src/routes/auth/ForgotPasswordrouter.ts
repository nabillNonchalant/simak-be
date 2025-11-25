import { Router } from 'express'
import ForgotPasswordController from '@/controllers/auth/ForgotPasswordController'
import VerifyOtpController from '@/controllers/auth/FerifyOtpController'
import ResetPasswordController from '@/controllers/auth/ResetPasswordController'
import { AuthMiddleware } from '@/middleware/AuthMiddleware'

const router = Router()

// PUBLIC — tidak butuh token
router.post('/forgot', ForgotPasswordController.forgotPassword)
router.post('/otp', VerifyOtpController.verifyOtp)
router.post('/reset', ResetPasswordController.resetPassword)

// PRIVATE — route setelah ini butuh token
router.use(AuthMiddleware)

// contoh (jika ada route lain yang perlu token)
router.get('/secure-example', (req, res) => {
  res.send('success with token')
})

export default router