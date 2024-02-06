"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.updatePlan = exports.updateUserName = exports.getUser = exports.checkUserIsLogin = exports.logout = exports.login = exports.signup = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validation_1 = require("../util/validation");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ msg: "เกิดข้อผิดพลาด", error: true });
        return;
    }
    if (!(0, validation_1.isEmail)(email) || !(0, validation_1.isPassword)(password)) {
        res.status(400).json({ msg: "รูปแบบไม่ถูกต้อง", error: true });
        return;
    }
    try {
        const hasUser = yield user_1.default.findOne({ email });
        if (hasUser) {
            res.status(401).json({ msg: "อีเมลนี้ใช้งานแล้ว", error: true });
            return;
        }
        const hashPw = yield bcrypt_1.default.hash(password, 12);
        yield user_1.default.create({ email, password: hashPw });
        const userDoc = yield user_1.default.findOne({ email });
        const token = jsonwebtoken_1.default.sign({ user: Object.assign(Object.assign({}, userDoc.toObject()), { password: undefined }) }, process.env.JWT_SECRET, { expiresIn: "2h" });
        // res.cookie("token", token, {
        //   maxAge: 60 * 60 * 1000,
        //   httpOnly: true,
        //   secure: true,
        // });
        res.status(200).json({
            msg: "สมัครสมาชิกสำเร็จ",
            user: Object.assign(Object.assign({}, userDoc === null || userDoc === void 0 ? void 0 : userDoc.toObject()), { password: undefined }),
            token: token,
        });
    }
    catch (err) {
        res.status(404).json({ msg: err, error: true });
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ msg: "เกิดข้อผิดพลาด", error: true });
        return;
    }
    if (!(0, validation_1.isEmail)(email) || !(0, validation_1.isPassword)(password)) {
        res.status(400).json({ msg: "อีเมลหรือรหัสผ่านไม่ถูกต้อง", error: true });
        return;
    }
    try {
        const userDoc = yield user_1.default.findOne({ email });
        if (!userDoc) {
            res.status(401).json({ msg: "อีเมลหรือรหัสผ่านไม่ถูกต้อง", error: true });
            return;
        }
        const pwIsMatch = yield bcrypt_1.default.compare(password, userDoc.password);
        if (!pwIsMatch) {
            res.status(401).json({ msg: "อีเมลหรือรหัสผ่านไม่ถูกต้อง", error: true });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ user: Object.assign(Object.assign({}, userDoc.toObject()), { password: undefined }) }, process.env.JWT_SECRET, { expiresIn: "2h" });
        // res.cookie("token", token, {
        //   maxAge: 60 * 60 * 1000,
        //   httpOnly: true,
        //   secure: true,
        // });
        res.status(200).json({
            msg: "เข้าสู่ระบบสำเร็จ",
            user: Object.assign(Object.assign({}, userDoc.toObject()), { password: undefined }),
            token: token,
        });
    }
    catch (err) {
        res.status(404).json({ msg: err, error: true });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).clearCookie("token").json({ msg: "ออกจากระบบสำเร็จ" });
});
exports.logout = logout;
const checkUserIsLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    if (!token) {
        return res.status(200).json({ isLoggedIn: false });
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return res.status(401).json({ msg: "token ไม่ถูกต้อง", isLoggedIn: false });
    }
    res.status(200).json({ isLoggedIn: true });
});
exports.checkUserIsLogin = checkUserIsLogin;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const userDoc = yield user_1.default.findById(userId);
        if (!userDoc) {
            return res.status(401).json({ msg: "ไม่พบผู้ใช้นี้" });
        }
        res.status(200).json({
            user: Object.assign(Object.assign({}, userDoc.toObject()), { password: undefined }),
        });
    }
    catch (err) {
        res.status(404).json({ error: err });
    }
});
exports.getUser = getUser;
const updateUserName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const userDoc = yield user_1.default.findById({ _id: req.userId });
        if (!userDoc) {
            return res.status(404).json({ msg: "Not found" });
        }
        yield userDoc.updateOne({ name });
        return res.status(200).json({ msg: "อัพเดทข้อมูลเรียบร้อย" });
    }
    catch (err) {
        res.status(404).json({ msg: "เกิดข้อผิดพลาด" });
    }
});
exports.updateUserName = updateUserName;
const updatePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { plan } = req.body;
    try {
        const userDoc = yield user_1.default.findById({ _id: req.userId });
        const startedDate = new Date();
        const expiredDate = new Date(startedDate);
        expiredDate.setDate(startedDate.getDate() + 30);
        yield (userDoc === null || userDoc === void 0 ? void 0 : userDoc.updateOne({
            plan: {
                packageName: plan,
                startedDate,
                expiredDate,
            },
        }));
        res.status(200).json({ msg: "เพิ่มแพคเกจสำเร็จ" });
    }
    catch (err) {
        res.status(404).json({ error: err });
    }
});
exports.updatePlan = updatePlan;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    try {
        const userDoc = yield user_1.default.findById({ _id: req.userId });
        if (!userDoc)
            return res.status(404).json({ msg: "ไม่มีผู้ใช้นี้" });
        const isCurrentPwMatch = yield bcrypt_1.default.compare(currentPassword, userDoc.password);
        if (!isCurrentPwMatch)
            return res.status(400).json({ msg: "รหัสผ่านไม่ถูกต้อง" });
        const hashpw = yield bcrypt_1.default.hash(newPassword, 12);
        const isNewPwMatch = yield bcrypt_1.default.compare(userDoc.password, hashpw);
        if (isNewPwMatch)
            return res.status(400).json({ msg: "รหัสผ่านห้ามซ้ำกับรหัสเก่า" });
        yield userDoc.updateOne({ password: hashpw });
        res.status(200).json({ msg: "เปลี่ยนรหัสผ่านเสร็จสมบูรณ์" });
    }
    catch (err) {
        return res.status(404).json({ msg: "เกิดข้อผิดพลาด" });
    }
});
exports.updatePassword = updatePassword;
