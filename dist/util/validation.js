"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPassword = exports.isEmail = void 0;
const isEmail = (email) => {
    return email.includes("@") && email.length >= 8;
};
exports.isEmail = isEmail;
const isPassword = (password) => {
    return password.length > 5 && password.match(/^[a-zA-Z0-9]+$/);
};
exports.isPassword = isPassword;
