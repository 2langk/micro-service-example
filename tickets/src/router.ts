import { Router } from 'express';
import { checkLogin, mustLogin } from '@2langk-common/mse';
import {
	getAllTicket,
	getOneTicket,
	createTicket,
	updateTicket
} from './controller';

const router = Router();

router.use(checkLogin);
router.use(mustLogin);

router.route('/').get(getAllTicket).post(createTicket);
router.route('/:id').get(getOneTicket).patch(updateTicket);
export default router;
