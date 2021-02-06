"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
class Listener {
    constructor(natsClient) {
        this.natsClient = natsClient;
    }
    subscriptionOptions() {
        return this.natsClient
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(5000)
            .setDurableName(this.queueGroupName);
    }
    listen() {
        const subscription = this.natsClient.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());
        subscription.on('message', (msg) => {
            console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
            const data = msg.getData();
            const parsedData = typeof data === 'string'
                ? JSON.parse(data)
                : JSON.parse(data.toString('utf8'));
            this.onMessage(parsedData, msg);
        });
    }
}
exports.Listener = Listener;
