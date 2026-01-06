import express from 'express';
import { getAllNews, createNews , fetchExternalNews } from '../controllers/newsController.js';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'; 

const router = express.Router();
router.use(ensureAuthenticated);

router.get('/', getAllNews);
router.post('/', createNews); 
router.get('/external', fetchExternalNews);

export default router;