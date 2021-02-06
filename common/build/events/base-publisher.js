"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = void 0;
class Publisher {
    constructor(natsClient) {
        this.natsClient = natsClient;
    }
    publish(data) {
        return new Promise((resolve, reject) => {
            this.natsClient.publish(this.subject, JSON.stringify(data), (err) => {
                if (err) {
                    return reject(err);
                }
                console.log('Event published to subject', this.subject);
                resolve();
            });
        });
    }
}
exports.Publisher = Publisher;
