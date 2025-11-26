import { Router } from 'express';
import { authRequired, requireRole } from '../middleware/auth.js';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orders.controller.js';

const router = Router();

router.post('/', authRequired, createOrder);
router.get('/my', authRequired, getMyOrders);
router.get('/', authRequired, requireRole('admin'), getAllOrders);
router.patch('/:id/status', authRequired, requireRole('admin'), updateOrderStatus);

export default router;
