"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// @ts-ignore
const validator_1 = __importDefault(require("validator"));
const testSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: [true, "Please provide your full name!"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email!"],
        unique: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, "Please provide a valid email address!"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password!"],
        minlength: 8,
        select: false,
    },
}, { timestamps: true });
const Test = mongoose_1.default.model("Test", testSchema);
exports.default = Test;
