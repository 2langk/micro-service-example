import { Subjects } from './subjects';
export interface TicketCreatedEvent {
    subject: Subjects.TicketCreated;
    data: {
        _id: string;
        title: string;
        price: number;
        userId: string;
        __v: number;
    };
}
export interface TicketUpdatedEvent {
    subject: Subjects.TicketUpdated;
    data: {
        _id: string;
        title: string;
        price: number;
        userId: string;
        orderId?: string;
        __v: number;
    };
}
