import { catchAsync, AppError } from '@2langk-common/mse';
import { Request, Response, NextFunction } from 'express';
// import Ticket from './Ticket';
import natsClient from './events/nats-connect';

export const createOrder = catchAsync(
	async (req: Request, res: Response) => {}
);

export const getOneOrder = catchAsync(
	async (req: Request, res: Response) => {}
);

export const updateOrder = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {}
);
