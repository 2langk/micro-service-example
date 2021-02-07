import { Router } from 'express';
// import {} from 'controller'

const router = Router();

router.route('/').get().post();
router.route('/:id').get().patch();

export default router;
