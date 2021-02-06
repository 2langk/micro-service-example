import { RequestHandler } from 'express';

const catchAsync = (fn: any): RequestHandler => (req, res, next) => {
	fn(req, res, next).catch(next);
};

// eslint-disable-next-line import/prefer-default-export
export { catchAsync };
