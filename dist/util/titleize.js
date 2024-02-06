"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashString = void 0;
const dashString = (str) => {
    return str.replace(/:/g, "").replace(/\s+/g, "-");
};
exports.dashString = dashString;
