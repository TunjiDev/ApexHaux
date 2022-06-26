import mongoose from "mongoose";
// @ts-ignore
import validator from "validator";

const testSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please provide your full name!"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email!"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address!"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password!"],
      minlength: 8,
      select: false,
    },
  },
  { timestamps: true }
);

const Test = mongoose.model("Test", testSchema);
export default Test;
