import { Listener, Subjects, OrderCreatedEvent } from '@2langk-common/mse';
import { Message } from 'node-nats-streaming';
import * as Queue from 'bull';
import natsClient from './nats-connect';
import { OrderExpiredPublisher } from './publisher';

const expirationQueue = new Queue<{
	orderId: string;
}>('order:expiration', {
	redis: {
		host: 'http://localhost:6379'
	}
});

expirationQueue.process(async (job) => {
	console.log('publish expiration event');
	new OrderExpiredPublisher(natsClient).publish({
		_id: job.data.orderId,
		__v: 0
	});
});

export class OrderCreatedListner extends Listener<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;

	queueGroupName = 'expiration-service';

	// eslint-disable-next-line class-methods-use-this
	async onMessage(
		data: OrderCreatedEvent['data'],
		msg: Message
	): Promise<void> {
		await expirationQueue.add(
			{
				orderId: data._id
			},
			{
				delay: 10000
			}
		);

		msg.ack();
	}
}
