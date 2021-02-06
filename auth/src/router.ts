import { Router } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppError, checkLogin, mustLogin } from '@2langk-common/mse';
import User from './User';

const router = Router();

router.post('/register', async (req, res) => {
	const { email, password } = req.body;

	const newUser = await User.create({ email, password });

	res.status(200).json({
		status: 'success',
		newUser
	});
});

router.post('/login', async (req, res, next) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email, password });

	if (!user) return next(new AppError('비밀번호를 확인하세요', 400));

	const token = jwt.sign({ user }, 'jwt_secret', {
		expiresIn: '1d'
	});

	const cookieOptions = {
		expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
		httpOnly: true
	};

	res.cookie('jwt', token, cookieOptions);

	res.status(200).json({
		status: 'success'
	});
});

router.get('/logout', checkLogin, mustLogin, (req, res) => {
	const token = jwt.sign({ user: 'undefined' }, 'jwt_secret', {
		expiresIn: '1s'
	});

	const cookieOptions = {
		expires: new Date(Date.now() + 1000),
		httpOnly: true
	};

	res.cookie('jwt', token, cookieOptions);

	res.status(200).json({
		status: 'success'
	});
});

export default router;
