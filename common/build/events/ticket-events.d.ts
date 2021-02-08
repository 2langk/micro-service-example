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
export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data: {
        _id: string;
        userId: string;
        status: 'pending' | 'completed' | 'cancelled';
        expiresAt: Date;
        __v: number;
        ticket: {
            _id: string;
            __v: number;
        };
    };
}
export interface OrderUpdatedEvent {
    subject: Subjects.OrderUpdated;
    data: {
        _id: string;
        userId: string;
        status: 'pending' | 'completed' | 'cancelled';
        expiresAt: Date;
        __v: number;
        ticket: {
            _id: string;
            __v: number;
        };
    };
}
export interface OrderExpiredEvent {
    subject: Subjects.OrderExpired;
    data: {
        _id: string;
        __v: number;
    };
}
