"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
