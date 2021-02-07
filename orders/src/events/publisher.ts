// eslint-disable-next-line max-classes-per-file
import {
	Publisher,
	Subjects,
	OrderCreatedEvent,
	OrderUpdatedEvent
} from '@2langk-common/mse';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEvent> {
	subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
}
