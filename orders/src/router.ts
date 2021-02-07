import { Router } from 'express';
import { checkLogin, mustLogin } from '@2langk-common/mse';
import { createOrder, updateOrder } from './controller';

const router = Router();

router.use(checkLogin);
router.use(mustLogin);

router.route('/').post(createOrder);
router.route('/:id').get().patch(updateOrder);

export default router;
