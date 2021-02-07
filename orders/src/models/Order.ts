import * as mongoose from 'mongoose';
import { TicketDoc } from './Ticket';

interface OrderDoc extends mongoose.Document {
	userId: string;
	status: 'pending' | 'completed' | 'cancelled';
	expiresAt: Date;
	ticket: TicketDoc;
}

type OrderModel = mongoose.Model<OrderDoc>;

const orderSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true
	},
	status: {
		type: String,
		required: true,
		enum: ['pending', 'completed', 'cancelled'],
		default: 'pending'
	},
	expiresAt: {
		type: mongoose.Schema.Types.Date,
		default: () => Date.now() + 60 * 1000
	},
	ticket: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Ticket'
	}
});

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export default Order;
