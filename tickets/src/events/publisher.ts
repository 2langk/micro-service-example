// eslint-disable-next-line max-classes-per-file
import {
	Publisher,
	Subjects,
	TicketCreatedEvent,
	TicketUpdatedEvent
} from '@2langk-common/mse';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
