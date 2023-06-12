import express from 'express';
import {
  deleteUserAccount,
  emailForForgetPassword,
  emailVerificationByCode,
  forgetPassword,
  getCurrentUserInfo,
  logInUser,
  registerNewUser,
  resendVerificationCode,
  resendVerificationCodeForForgetPassword,
  updateUserProfile,
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
router.put('/update-user-details/:id', updateUserProfile);
router.delete('/delete-user-account/:id', deleteUserAccount);
export default router;
