// eslint-disable-next-line max-classes-per-file
import { Publisher, Subjects, OrderExpiredEvent } from '@2langk-common/mse';

export class OrderExpiredPublisher extends Publisher<OrderExpiredEvent> {
	subject: Subjects.OrderExpired = Subjects.OrderExpired;
}
