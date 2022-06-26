"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);
exports.default = catchAsync;
