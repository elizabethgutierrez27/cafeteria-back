import { Router } from 'express';
import { authRequired, requireRole } from '../middleware/auth.js';
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/products.controller.js';

const router = Router();

router.get('/', listProducts);
router.post('/', authRequired, requireRole('admin'), createProduct);
router.put('/:id', authRequired, requireRole('admin'), updateProduct);
router.delete('/:id', authRequired, requireRole('admin'), deleteProduct);

export default router;
