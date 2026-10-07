import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getCurrentBudget,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController.js';

const router = Router();

router.use(requireAuth);

router.get('/current', getCurrentBudget);
router.post('/', createBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;
