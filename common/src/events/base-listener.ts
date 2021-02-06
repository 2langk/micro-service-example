import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
	subject: Subjects;
	data: any;
}

export abstract class Listener<T extends Event> {
	abstract subject: T['subject'];

	abstract queueGroupName: string;

	abstract onMessage(data: T['data'], msg: Message): void;

	protected natsClient: Stan;

	constructor(natsClient: Stan) {
		this.natsClient = natsClient;
	}

	subscriptionOptions() {
		return this.natsClient
			.subscriptionOptions()
			.setDeliverAllAvailable()
			.setManualAckMode(true)
			.setAckWait(5000)
			.setDurableName(this.queueGroupName);
	}

	listen(): void {
		const subscription = this.natsClient.subscribe(
			this.subject,
			this.queueGroupName,
			this.subscriptionOptions()
		);

		subscription.on('message', (msg: Message) => {
			console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

			const data = msg.getData();

			const parsedData =
				typeof data === 'string'
					? JSON.parse(data)
					: JSON.parse(data.toString('utf8'));

			this.onMessage(parsedData, msg);
		});
	}
}
