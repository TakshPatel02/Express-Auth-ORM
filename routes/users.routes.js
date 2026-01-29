import express from 'express';
import { signup, login, getUserData, updateUserData, logout } from '../controller/user.controller.js'

const router = express.Router();

router.get('/', getUserData); // current user info route

router.patch('/', updateUserData); // update user info route

router.post('/signup', signup); // user registration route

router.post('/login', login); // user login route

router.delete('/logout', logout); // user logout route

export default router;