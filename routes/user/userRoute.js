import express from 'express';
import {
  forgetPassword,
  getCurrentUserInfo,
  logInUser,
  registerNewUser,
} from '../../controllers/user/userController.js';
import { validateToken } from '../../middlewares/tokenHandler.js';
const router = express.Router();

router.post('/register', registerNewUser);
router.post('/login', logInUser);
router.get('/me',validateToken,getCurrentUserInfo)
router.post('/forget-password',forgetPassword)
export default router;
