// listener
import {
	Listener,
	TicketCreatedEvent,
	TicketUpdatedEvent,
	OrderExpiredEvent,
	Subjects,
	AppError
} from '@2langk-common/mse';

import { Message } from 'node-nats-streaming';
import Ticket from '../models/Ticket';
import Order from '../models/Order';
import { OrderUpdatedPublisher } from './publisher';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated;

	queueGroupName = 'orders-service';

	// eslint-disable-next-line class-methods-use-this
	async onMessage(
		data: TicketCreatedEvent['data'],
		msg: Message
	): Promise<void> {
		const { _id, title, price, __v, userId } = data;

		await Ticket.create({ _id, title, price, userId, __v });

		msg.ack();
	}
}

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

	queueGroupName = 'orders-service';

	// eslint-disable-next-line class-methods-use-this
	async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
		try {
			const { _id, title, price, __v, orderId } = data;

			const ticket = await Ticket.findOne({ _id, __v: __v - 1 });

			if (!ticket) throw new AppError('유효하지 않은 티켓입니다.', 400);

			ticket.title = title;
			ticket.price = price;
			ticket.orderId = orderId;
			ticket.__v = __v;

			await ticket.save();

			msg.ack();
		} catch (e) {
			console.error(e);
		}
	}
}

export class OrderExpiredListener extends Listener<OrderExpiredEvent> {
	subject: Subjects.OrderExpired = Subjects.OrderExpired;

	queueGroupName = 'orders-service';

	// eslint-disable-next-line class-methods-use-this
	async onMessage(
		data: OrderExpiredEvent['data'],
		msg: Message
	): Promise<void> {
		try {
			const order = await Order.findById(data._id).populate('ticket');

			if (!order) return msg.ack();
			if (order.status === 'completed') return msg.ack();

			order.status = 'cancelled';
			order.__v! += 1;

			await order.save();
			await new OrderUpdatedPublisher(this.natsClient).publish({
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
			msg.ack();
		} catch (e) {
			console.error(e);
		}
	}
}
