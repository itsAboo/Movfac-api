"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mediaController_1 = require("../controllers/mediaController");
const router = express_1.default.Router();
router.post("/add-media", mediaController_1.addMedia);
router.get("/get-media", mediaController_1.getAllMedia);
router.get("/get-media/:path", mediaController_1.getMedia);
router.get("/latest-media", mediaController_1.getLatestMedia);
router.get("/random-media", mediaController_1.getRandomMedia);
exports.default = router;
