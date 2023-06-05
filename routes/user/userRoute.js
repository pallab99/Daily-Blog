import express from 'express';
import { registerNewUser } from '../../controllers/user/userController.js';
const router = express.Router();

router.post('/register', registerNewUser);

export default router;
