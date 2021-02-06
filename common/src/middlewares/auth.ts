import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppError } from './AppError';
import { catchAsync } from './catchAsync';

interface User {
	id: string;
	email: string;
}

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		// eslint-disable-next-line no-shadow
		interface Request {
			user?: User;
		}
	}
}

export const checkLogin = (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies.jwt;

	const user = jwt.verify(token, 'jwt_secret') as User;

	if (user) {
		req.user = user;
	}
	console.log(user);
	next();
};

export const mustLogin = (req: Request, res: Response, next: NextFunction) => {
	if (!req.user) return next(new AppError('로그인이 필요합니다.', 400));

	next();
};
