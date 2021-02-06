import { Request, Response, NextFunction } from 'express';
interface User {
    id: string;
    email: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
export declare const checkLogin: (req: Request, res: Response, next: NextFunction) => void;
export declare const mustLogin: (req: Request, res: Response, next: NextFunction) => void;
export {};
