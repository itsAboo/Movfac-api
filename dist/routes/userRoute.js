"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../util/auth");
const router = express_1.default.Router();
router.post("/signup", userController_1.signup);
router.post("/login", userController_1.login);
router.post("/logout", userController_1.logout);
// router.get("/check-is-login", checkUserIsLogin);
router.get("/get-user", auth_1.verifyToken, userController_1.getUser);
router.patch("/update-user-name", auth_1.verifyToken, userController_1.updateUserName);
router.patch("/update-plan", auth_1.verifyToken, userController_1.updatePlan);
router.patch("/update-password", auth_1.verifyToken, userController_1.updatePassword);
exports.default = router;
