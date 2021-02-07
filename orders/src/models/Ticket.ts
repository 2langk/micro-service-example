import * as mongoose from 'mongoose';

interface TicketDoc extends mongoose.Document {
	title: string;
	price: number;
	userId: string;
	orderId?: string;
}

type TicketModel = mongoose.Model<TicketDoc>;

const ticketSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	userId: {
		type: String,
		required: true
	},
	orderId: {
		type: String
	}
});

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export default Ticket;
export { TicketDoc };
