import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as mongoose from 'mongoose';
import * as secret from './secret.json';

import router from './router';

const app = express();

app.set('trust proxy', true);
app.use(express.json());

app.use(cookieParser());

app.use('/api/auth', router);

// app.use(errorHandler);

mongoose
	.connect(secret.mongoURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	})
	.then(() => console.log('DB connected!'));

app.listen('3000', () => console.log('Auth Server is running on 3000'));
