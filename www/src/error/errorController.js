"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("./appError"));
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new appError_1.default(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const message = `${value} is already taken: Please use another value!`;
    return new appError_1.default(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data: ${errors.join(". ")}`;
    return new appError_1.default(message, 400);
};
const handleJWTError = () => new appError_1.default("Invalid token, Please log in again!", 401);
const handleJWTExpiredError = () => new appError_1.default("Your token has expired!, Please log in again.", 401);
const sendErrorDev = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith("/api")) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    // B) RENDERED WEBSITE
    console.log("ERROR!!!:", err);
    return res.status(err.statusCode).render("error", {
        title: "Something went wrong!",
        msg: err.message,
    });
};
const sendErrorProd = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith("/api")) {
        // A) Operational, trusted error: send message to client
        if (err.isOperational /*|| err.status === 'fail' || err.status === 'error'*/) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        // B) Programming or other unknown error: don't leak error details
        // 1) Log error
        console.log("ERROR!!!:", err);
        // 2) Send generic message
        return res.status(500).json({
            status: "error",
            message: "Something went very wrong!",
        });
    }
    // B) RENDERED WEBSITE
    // A) Operational, trusted error: send message to client
    if (err.isOperational /*|| err.status === 'fail' || err.status === 'error'*/) {
        return res.status(err.statusCode).render("error", {
            title: "Something went wrong!",
            msg: err.message,
        });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.log("ERROR!!!:", err);
    // 2) Send generic message
    return res.status(err.statusCode).render("error", {
        title: "Something went wrong!",
        msg: "Please try again later...",
    });
};
const errorController = (err, req, res, next) => {
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, req, res);
    }
    else if (process.env.NODE_ENV === "production") {
        if (err.name === "CastError")
            err = handleCastErrorDB(err);
        if (err.code === 11000)
            err = handleDuplicateFieldsDB(err);
        if (err.name === "ValidationError")
            err = handleValidationErrorDB(err);
        if (err.name === "JsonWebTokenError")
            err = handleJWTError();
        if (err.name === "TokenExpiredError")
            err = handleJWTExpiredError();
        sendErrorProd(err, req, res);
    }
};
exports.default = errorController;
