import path from "path";
import express, { Application, Request, Response, NextFunction } from "express";
import morgan from "morgan";
//import rateLimit from 'express-rate-limit'
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
// @ts-ignore
import xss from "xss-clean";
// @ts-ignore
import cookieParser from "cookie-parser";
// @ts-ignore
import compression from "compression";
// @ts-ignore
import cors from "cors";

import globalErrorHandler from "./src/error/errorController";
import AppError from "./src/error/appError";
import homeRouter from "./src/route/homeRoute";

//Start express app
const app: Application = express();

app.enable("trust proxy");

//GLOBAL MIDDLEWARES
app.use(express.static(path.join(__dirname, "public")));

// Implement CORS
app.use(cors()); // Access-Control-Allow-Origin * ('*' means all the requests no matter where they are coming from)

app.options("*", cors());

//Set security HTTP headers. NOTE: Always use for all ur express applications!
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Limit requests from the same API
// const limiter = rateLimit({
//   max: 100, //100 request per hour
//   windowMs: 60 * 60 * 1000, //1 hour in milliseconds
//   message: 'Too many request from this IP, please try again in an hour!'
// });
// app.use('/api', limiter);

//Body parser. Reading data from the body into req.body
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization XSS(cross-site scripting)
app.use(xss());

//Compress all the texts that is sent to clients
app.use(compression());

//ROUTES
app.use("/", homeRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
