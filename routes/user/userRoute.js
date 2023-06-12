import express from 'express';
import {
  emailForForgetPassword,
  emailVerificationByCode,
  forgetPassword,
  getCurrentUserInfo,
  logInUser,
  registerNewUser,
  resendVerificationCode,
  resendVerificationCodeForForgetPassword,
} from '../../controllers/user/userController.js';
import { validateToken } from '../../middlewares/tokenHandler.js';
const router = express.Router();

router.post('/register', registerNewUser);
router.post('/login', logInUser);
router.get('/me', validateToken, getCurrentUserInfo);
router.post('/forget-password', forgetPassword);
router.post('/verify-email', emailVerificationByCode);
router.post('/resent-verification-code', resendVerificationCode);
router.post('/emailForForgetPassword', emailForForgetPassword);
router.post(
  '/resend-verification-code-for-forget-password',
  resendVerificationCodeForForgetPassword
);
export default router;
