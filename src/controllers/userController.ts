import { RequestHandler } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import { isEmail, isPassword } from "../util/validation";
import jwt from "jsonwebtoken";

export const signup: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ msg: "เกิดข้อผิดพลาด", error: true });
    return;
  }
  if (!isEmail(email) || !isPassword(password)) {
    res.status(400).json({ msg: "รูปแบบไม่ถูกต้อง", error: true });
    return;
  }
  try {
    const hasUser = await User.findOne({ email });
    if (hasUser) {
      res.status(401).json({ msg: "อีเมลนี้ใช้งานแล้ว", error: true });
      return;
    }
    const hashPw = await bcrypt.hash(password, 12);
    await User.create({ email, password: hashPw });
    const userDoc = await User.findOne({ email });
    const token = jwt.sign(
      { user: { ...userDoc!.toObject(), password: undefined } },
      process.env.JWT_SECRET as string,
      { expiresIn: "2h" }
    );
    // res.cookie("token", token, {
    //   maxAge: 60 * 60 * 1000,
    //   httpOnly: true,
    //   secure: true,
    // });
    res.status(200).json({
      msg: "สมัครสมาชิกสำเร็จ",
      user: { ...userDoc?.toObject(), password: undefined },
      token: token,
    });
  } catch (err) {
    res.status(404).json({ msg: err, error: true });
  }
};

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ msg: "เกิดข้อผิดพลาด", error: true });
    return;
  }
  if (!isEmail(email) || !isPassword(password)) {
    res.status(400).json({ msg: "อีเมลหรือรหัสผ่านไม่ถูกต้อง", error: true });
    return;
  }
  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      res.status(401).json({ msg: "อีเมลหรือรหัสผ่านไม่ถูกต้อง", error: true });
      return;
    }
    const pwIsMatch = await bcrypt.compare(password, userDoc.password);
    if (!pwIsMatch) {
      res.status(401).json({ msg: "อีเมลหรือรหัสผ่านไม่ถูกต้อง", error: true });
      return;
    }
    const token = jwt.sign(
      { user: { ...userDoc.toObject(), password: undefined } },
      process.env.JWT_SECRET as string,
      { expiresIn: "2h" }
    );
    // res.cookie("token", token, {
    //   maxAge: 60 * 60 * 1000,
    //   httpOnly: true,
    //   secure: true,
    // });
    res.status(200).json({
      msg: "เข้าสู่ระบบสำเร็จ",
      user: { ...userDoc.toObject(), password: undefined },
      token: token,
    });
  } catch (err) {
    res.status(404).json({ msg: err, error: true });
  }
};

export const logout: RequestHandler = async (req, res) => {
  res.status(200).clearCookie("token").json({ msg: "ออกจากระบบสำเร็จ" });
};

export const checkUserIsLogin: RequestHandler = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(200).json({ isLoggedIn: false });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  if (!decoded) {
    return res.status(401).json({ msg: "token ไม่ถูกต้อง", isLoggedIn: false });
  }
  res.status(200).json({ isLoggedIn: true });
};

export const getUser: RequestHandler = async (req, res) => {
  const userId = req.userId;
  try {
    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return res.status(401).json({ msg: "ไม่พบผู้ใช้นี้" });
    }
    res.status(200).json({
      user: { ...userDoc.toObject(), password: undefined },
    });
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

export const updateUserName: RequestHandler = async (req, res) => {
  const { name } = req.body;
  try {
    const userDoc = await User.findById({ _id: req.userId });
    if (!userDoc) {
      return res.status(404).json({ msg: "Not found" });
    }
    await userDoc.updateOne({ name });
    return res.status(200).json({ msg: "อัพเดทข้อมูลเรียบร้อย" });
  } catch (err) {
    res.status(404).json({ msg: "เกิดข้อผิดพลาด" });
  }
};

export const updatePlan: RequestHandler = async (req, res) => {
  const { plan } = req.body;
  try {
    const userDoc = await User.findById({ _id: req.userId });
    const startedDate = new Date();
    const expiredDate = new Date(startedDate);
    expiredDate.setDate(startedDate.getDate() + 30);
    await userDoc?.updateOne({
      plan: {
        packageName: plan,
        startedDate,
        expiredDate,
      },
    });
    res.status(200).json({ msg: "เพิ่มแพคเกจสำเร็จ" });
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const userDoc = await User.findById({ _id: req.userId });
    if (!userDoc) return res.status(404).json({ msg: "ไม่มีผู้ใช้นี้" });
    const isCurrentPwMatch = await bcrypt.compare(
      currentPassword,
      userDoc.password
    );
    if (!isCurrentPwMatch)
      return res.status(400).json({ msg: "รหัสผ่านไม่ถูกต้อง" });
    const hashpw = await bcrypt.hash(newPassword, 12);
    const isNewPwMatch = await bcrypt.compare(userDoc.password, hashpw);
    if (isNewPwMatch)
      return res.status(400).json({ msg: "รหัสผ่านห้ามซ้ำกับรหัสเก่า" });
    await userDoc.updateOne({ password: hashpw });
    res.status(200).json({ msg: "เปลี่ยนรหัสผ่านเสร็จสมบูรณ์" });
  } catch (err) {
    return res.status(404).json({ msg: "เกิดข้อผิดพลาด" });
  }
};
