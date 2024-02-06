import express from "express";
import {
  checkUserIsLogin,
  getUser,
  login,
  logout,
  signup,
  updatePassword,
  updatePlan,
  updateUserName,
} from "../controllers/userController";
import { verifyToken } from "../util/auth";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

// router.get("/check-is-login", checkUserIsLogin);

router.get("/get-user", verifyToken, getUser);

router.patch("/update-user-name", verifyToken, updateUserName);

router.patch("/update-plan", verifyToken, updatePlan);

router.patch("/update-password", verifyToken, updatePassword);

export default router;
