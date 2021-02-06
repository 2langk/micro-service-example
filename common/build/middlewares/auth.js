"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mustLogin = exports.checkLogin = void 0;
const jwt = require("jsonwebtoken");
const AppError_1 = require("./AppError");
const checkLogin = (req, res, next) => {
    const token = req.cookies.jwt;
    const user = jwt.verify(token, 'jwt_secret');
    if (user) {
        req.user = user;
    }
    console.log(user);
    next();
};
exports.checkLogin = checkLogin;
const mustLogin = (req, res, next) => {
    if (!req.user)
        return next(new AppError_1.AppError('로그인이 필요합니다.', 400));
    next();
};
exports.mustLogin = mustLogin;
