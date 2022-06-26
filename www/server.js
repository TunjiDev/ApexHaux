"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./config.env" });
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥💥💥 Shutting down...");
    console.log(err.name, err.message, err, err.stack);
    process.exit(1);
});
// const app = require("./app");
const app_1 = __importDefault(require("./app"));
const port = process.env.PORT || 9292;
// @ts-ignore
const DB = process.env.DATABASE.replace("<password>", 
// @ts-ignore
process.env.DATABASE_PASSWORD);
// const DB: string = "mongodb://localhost:27017/userdb";
mongoose_1.default
    .connect(DB, {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Database connection successful!"));
const server = app_1.default.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥💥💥 Shutting down...");
    console.log(err.name, err.message, err);
    server.close(() => {
        process.exit(1);
    });
});
// SIGTERM is a signal that is used to cause a program to stop running
process.on("SIGTERM", () => {
    console.log("SIGTERM RECEIVED. Shutting down gracefully.");
    server.close(() => {
        console.log("💥💥💥 Process terminated!");
    });
});
console.log(process.env.NODE_ENV);
console.log(process.env.DATABASE_PASSWORD);
exports.default = server;
