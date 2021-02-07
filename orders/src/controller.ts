import { catchAsync, AppError } from '@2langk-common/mse';
import { Request, Response, NextFunction } from 'express';
import Order from './models/Order';
import Ticket from './models/Ticket';
import natsClient from './events/nats-connect';
import {
	OrderCreatedPublisher,
	OrderUpdatedPublisher
} from './events/publisher';

export const createOrder = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { ticketId } = req.body;

		const ticket = await Ticket.findById(ticketId);
		if (!ticket) return next(new AppError('티켓을 찾을수 없습니다', 400));

		if (ticket.orderId) return next(new AppError('예약된 티켓입니다', 400));

		const newOrder = await Order.create({
			userId: req.user!._id,
			ticket: ticket._id
		});

		ticket.orderId = newOrder._id;
		await ticket.save();

		await new OrderCreatedPublisher(natsClient).publish({
			_id: newOrder._id,
			status: newOrder.status,
			userId: newOrder.userId,
			expiresAt: newOrder.expiresAt,
			__v: newOrder.__v!,
			ticket: {
				_id: ticket._id,
				__v: ticket.__v!
			}
		});

		res.json({
			newOrder
		});
	}
);

// export const getOneOrder = catchAsync(
// 	async (req: Request, res: Response) => {}
// );

export const updateOrder = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const { status } = req.body as {
			status: 'pending' | 'cancelled' | 'completed';
		};

		const order = await Order.findById(req.params.id).populate('ticket');

		if (!order || order.status === 'cancelled')
			return next(new AppError('주문을 찾을 수 없습니다', 400));

		order.status = status;
		order.__v! += 1;

		await order.save();
		await new OrderUpdatedPublisher(natsClient).publish({
			_id: order._id,
			status: order.status,
			userId: order.userId,
			expiresAt: order.expiresAt,
			__v: order.__v!,
			ticket: {
				_id: order.ticket._id,
				__v: order.ticket.__v!
			}
		});

		res.json({
			order
		});
	}
);
