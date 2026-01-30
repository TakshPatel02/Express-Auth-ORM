import express from 'express';
import { signup, login, getUserData, updateUserData, logout } from '../controller/user.controller.js'
import auth from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/me', auth, getUserData); // current user info route

router.patch('/', auth, updateUserData); // update user info route

router.post('/signup', signup); // user registration route

router.post('/login', login); // user login route

router.delete('/logout', logout); // user logout route

export default router;