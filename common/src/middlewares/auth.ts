import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppError } from './AppError';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		// eslint-disable-next-line no-shadow
		interface Request {
			user?: any;
		}
	}
}

export const checkLogin: RequestHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.cookies.jwt;

	const decode = jwt.verify(token, 'jwt_secret') as any;

	if (decode) {
		req.user = decode.user;
	}
	next();
};

export const mustLogin: RequestHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.user) return next(new AppError('로그인이 필요합니다.', 400));

	next();
};
