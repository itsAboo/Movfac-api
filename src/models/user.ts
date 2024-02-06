import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    plan: {
      type: {
        packageName: String,
        startedDate: Date,
        expiredDate: Date,
      },
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;
