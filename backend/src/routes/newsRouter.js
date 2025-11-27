import express from 'express';
import { getAllNews, createNews } from '../controllers/newsController.js';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'; 

const router = express.Router();
router.use(ensureAuthenticated);

router.get('/', getAllNews);
router.post('/', createNews); 

export default router;