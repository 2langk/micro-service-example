import * as nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

const natsClient = nats.connect('mse', randomBytes(4).toString('hex'), {
	url: 'http://localhost:4222'
});

export default natsClient;
