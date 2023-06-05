import express from 'express';
import {
  logInUser,
  registerNewUser,
} from '../../controllers/user/userController.js';
const router = express.Router();

router.post('/register', registerNewUser);
router.post('/login', logInUser);

export default router;
