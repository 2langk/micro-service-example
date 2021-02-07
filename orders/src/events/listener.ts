// listener
import {
	Listener,
	TicketCreatedEvent,
	TicketUpdatedEvent,
	Subjects,
	AppError
} from '@2langk-common/mse';

import { Message } from 'node-nats-streaming';
import Ticket from '../models/Ticket';

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
