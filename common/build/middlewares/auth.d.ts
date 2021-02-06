import { RequestHandler } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
export declare const checkLogin: RequestHandler;
export declare const mustLogin: RequestHandler;
