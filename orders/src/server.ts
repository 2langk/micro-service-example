import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as mongoose from 'mongoose';
import { globalErrorHandler } from '@2langk-common/mse';
import * as secret from './secret.json';
import natsClient from './events/nats-connect';
import {
	TicketCreatedListener,
	TicketUpdatedListener
} from './events/listener';
import router from './router';

process.env.NODE_ENV = 'development';

const app = express();

app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());

app.use('/api/orders', router);

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
	new TicketCreatedListener(natsClient).listen();
	new TicketUpdatedListener(natsClient).listen();

	process.on('SIGINT', () => natsClient.close());
	process.on('SIGTERM', () => natsClient.close());
});

app.listen('3002', () => console.log('Orders Server is running on 3002'));
