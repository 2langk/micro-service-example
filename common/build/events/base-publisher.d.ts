import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';
interface Event {
    subject: Subjects;
    data: any;
}
export declare abstract class Publisher<T extends Event> {
    abstract subject: T['subject'];
    protected natsClient: Stan;
    constructor(natsClient: Stan);
    publish(data: T['data']): Promise<void>;
}
export {};
