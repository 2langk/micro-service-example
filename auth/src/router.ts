import { Router } from 'express';
import * as jwt from 'jsonwebtoken';
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

router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email, password });

	if (!user) return res.json({ status: 'fail' });

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

router.get('/logout', (req, res) => {
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
