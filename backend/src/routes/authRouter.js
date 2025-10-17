import express from 'express';
import { validateLogin, validateSignUp } from '../middlewares/authValidation.js';
import { login, signup } from '../controllers/authController.js';


const router = express.Router();

router.post("/signup", validateSignUp , signup);

router.post("/login" , validateLogin , login);

export default router;