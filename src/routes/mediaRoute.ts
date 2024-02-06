import express from "express";
import {
  addMedia,
  getAllMedia,
  getLatestMedia,
  getMedia,
  getRandomMedia,
} from "../controllers/mediaController";

const router = express.Router();

router.post("/add-media", addMedia);

router.get("/get-media", getAllMedia);

router.get("/get-media/:path", getMedia);

router.get("/latest-media", getLatestMedia);

router.get("/random-media", getRandomMedia);

export default router;
