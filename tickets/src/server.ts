import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as mongoose from 'mongoose';
import { globalErrorHandler } from '@2langk-common/mse';
import * as secret from './secret.json';
import natsClient from './events/nats-connect';
import { OrderCreatedListener, OrderUpdatedListener } from './events/listener';
import router from './router';

process.env.NODE_ENV = 'development';

const app = express();

app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());

app.use('/api/tickets', router);

app.use(globalErrorHandler);

mongoose
	.connect(secret.mongoURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	})
	.then(() => console.log('DB connected!'));

natsClient.on('connect', () => {
	console.log('NATS connected!');
	natsClient.on('close', () => {
		console.log('NATS connection closed!');
		process.exit();
	});

	// listeners
	new OrderCreatedListener(natsClient).listen();
	new OrderUpdatedListener(natsClient).listen();
});

process.on('SIGINT', () => natsClient.close());
process.on('SIGTERM', () => natsClient.close());

app.listen('3001', () => console.log('Tickets Server is running on 3001'));
