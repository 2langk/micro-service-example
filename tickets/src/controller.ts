/* eslint-disable no-underscore-dangle */
import { catchAsync, AppError } from '@2langk-common/mse';
import { Request, Response, NextFunction } from 'express';
import Ticket from './Ticket';
import natsClient from './events/nats-connect';
import {
	TicketCreatedPublisher,
	TicketUpdatedPublisher
} from './events/publisher';

export const createTicket = catchAsync(async (req: Request, res: Response) => {
	const { title, price } = req.body;
	const ticket = await Ticket.create({
		title,
		price,
		userId: req.user!._id
	});

	await new TicketCreatedPublisher(natsClient).publish({
		_id: ticket._id,
		title: ticket.title,
		price: ticket.price,
		userId: ticket.userId,
		__v: ticket.__v!
	});

	res.status(201).json(ticket);
});

export const getAllTicket = catchAsync(async (req: Request, res: Response) => {
	const tickets = await Ticket.find({});

	res.json(tickets);
});

export const getOneTicket = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const ticket = await Ticket.findById(req.params.id);

		if (!ticket) return next(new AppError('error', 400));

		res.json(ticket);
	}
);

export const updateTicket = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const ticket = await Ticket.findById(req.params.id);

		if (!ticket) return next(new AppError('error', 400));

		if (ticket.orderId) return next(new AppError('예약된 티켓입니다.', 400));

		if (ticket.userId !== req.user!._id) return next(new AppError('.', 400));

		ticket.title = req.body.title;
		ticket.price = req.body.price;
		ticket.__v! += 1;

		await ticket.save();

		await new TicketUpdatedPublisher(natsClient).publish({
			_id: ticket._id,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId,
			__v: ticket.__v!
		});

		res.json(ticket);
	}
);

// export const deleteTicket = catchAsync(
// 	async (req: Request, res: Response, next: NextFunction) => {}
// );
