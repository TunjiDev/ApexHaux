"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
//import rateLimit from 'express-rate-limit'
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
// @ts-ignore
const xss_clean_1 = __importDefault(require("xss-clean"));
// @ts-ignore
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// @ts-ignore
const compression_1 = __importDefault(require("compression"));
// @ts-ignore
const cors_1 = __importDefault(require("cors"));
const errorController_1 = __importDefault(require("./src/error/errorController"));
const appError_1 = __importDefault(require("./src/error/appError"));
const homeRoute_1 = __importDefault(require("./src/route/homeRoute"));
//Start express app
const app = (0, express_1.default)();
app.enable("trust proxy");
//GLOBAL MIDDLEWARES
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
// Implement CORS
app.use((0, cors_1.default)()); // Access-Control-Allow-Origin * ('*' means all the requests no matter where they are coming from)
app.options("*", (0, cors_1.default)());
//Set security HTTP headers. NOTE: Always use for all ur express applications!
app.use((0, helmet_1.default)());
//Development logging
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
//Limit requests from the same API
// const limiter = rateLimit({
//   max: 100, //100 request per hour
//   windowMs: 60 * 60 * 1000, //1 hour in milliseconds
//   message: 'Too many request from this IP, please try again in an hour!'
// });
// app.use('/api', limiter);
//Body parser. Reading data from the body into req.body
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.use((0, cookie_parser_1.default)());
//Data sanitization against NoSQL query injection
app.use((0, express_mongo_sanitize_1.default)());
//Data sanitization XSS(cross-site scripting)
app.use((0, xss_clean_1.default)());
//Compress all the texts that is sent to clients
app.use((0, compression_1.default)());
//ROUTES
app.use("/", homeRoute_1.default);
app.all("*", (req, res, next) => {
    next(new appError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorController_1.default);
exports.default = app;
