"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
// eslint-disable-next-line import/prefer-default-export
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 500 ? 'error' : 'fail';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
