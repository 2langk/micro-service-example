import { RequestHandler } from 'express';
declare const catchAsync: (fn: any) => RequestHandler;
export { catchAsync };
