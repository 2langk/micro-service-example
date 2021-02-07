// listener
import {
	Listener,
	Subjects,
	OrderCreatedEvent,
	AppError,
	OrderUpdatedEvent
} from '@2langk-common/mse';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedPublisher } from './publisher';
import Ticket from '../Ticket';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;

	queueGroupName = 'tickets-service';

	// eslint-disable-next-line class-methods-use-this
	async onMessage(
		data: OrderCreatedEvent['data'],
		msg: Message
	): Promise<void> {
		const ticket = await Ticket.findById(data.ticket._id);

		if (ticket?.__v !== data.ticket.__v)
			throw new AppError('티켓이 없거나 버전이 다릅니다.', 400);

		ticket.orderId = data._id;
		ticket.__v += 1;

		await ticket.save();
		await new TicketUpdatedPublisher(this.natsClient).publish({
			_id: ticket._id,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId,
			orderId: ticket.orderId,
			__v: ticket.__v!
		});

		msg.ack();
	}
}

export class OrderUpdatedListener extends Listener<OrderUpdatedEvent> {
	subject: Subjects.OrderUpdated = Subjects.OrderUpdated;

	queueGroupName = 'tickets-service';

	// eslint-disable-next-line class-methods-use-this
	async onMessage(
		data: OrderCreatedEvent['data'],
		msg: Message
	): Promise<void> {
		const ticket = await Ticket.findById(data.ticket._id);

		if (ticket?.__v !== data.ticket.__v)
			throw new AppError('티켓이 없거나 버전이 다릅니다.', 400);

		if (data.status === 'cancelled') {
			ticket.orderId = undefined;
		}

		ticket.__v += 1;

		await ticket.save();
		await new TicketUpdatedPublisher(this.natsClient).publish({
			_id: ticket._id,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId,
			orderId: ticket.orderId,
			__v: ticket.__v!
		});

		msg.ack();
	}
}
