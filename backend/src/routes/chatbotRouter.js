import express from 'express'
import { chatWithBot, getChatById, getUserChats } from '../controllers/chatbotController.js';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';

const router = express.Router();

router.use(ensureAuthenticated);

router.post('/', chatWithBot);
router.get('/', getUserChats);
router.get('/:chatId', getChatById);

export default router;