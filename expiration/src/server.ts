import natsClient from './events/nats-connect';
import { OrderCreatedListner } from './events/listener';

natsClient.on('connect', () => {
	console.log('NATS connected!');
	natsClient.on('close', () => {
		console.log('NATS connection closed!');
		process.exit();
	});

	// listeners
	new OrderCreatedListner(natsClient).listen();
});

process.on('SIGINT', () => natsClient.close());
process.on('SIGTERM', () => natsClient.close());
