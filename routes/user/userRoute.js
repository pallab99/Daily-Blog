import express from 'express';
import {
  getCurrentUserInfo,
  logInUser,
  registerNewUser,
} from '../../controllers/user/userController.js';
import { validateToken } from '../../middlewares/tokenHandler.js';
const router = express.Router();

router.post('/register', registerNewUser);
router.post('/login', logInUser);
router.get('/me',validateToken,getCurrentUserInfo)
export default router;
