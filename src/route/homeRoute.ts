import express, { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";

const router = express.Router();

// router.all(
//   '/',
//   catchAsync(async (req, res, next) => {
//     res.redirect(
//       'https://documenter.getpostman.com/view/15594941/UVXerHfY'
//     );
//   })
// );
export default router;
