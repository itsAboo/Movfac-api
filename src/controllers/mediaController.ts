import { RequestHandler } from "express";
import Media from "../models/media";

// interface MediaTypes {
//   _id: string;
//   title: string;
//   imageUrl: string;
//   description: string;
//   type: string;
//   genre: string[];
//   subtitle: string;
//   releaseDate: Date;
//   duration: number;
//   rating?: number;
//   path: string;
//   embedUrl: string;
//   propImageUrl: string;
// }

export const addMedia: RequestHandler = async (req, res) => {
  const {
    title,
    imageUrl,
    embedUrl,
    description,
    type,
    genre,
    subtitle,
    releaseDate,
    duration,
    rating,
    propImageUrl,
  } = req.body;
  if (
    !(
      title &&
      imageUrl &&
      embedUrl &&
      description &&
      type &&
      genre &&
      subtitle &&
      releaseDate &&
      duration &&
      propImageUrl
    )
  ) {
    res.status(404).json({ msg: "ข้อมูลไม่ครบ", error: true });
    return;
  }
  try {
    const mediaDoc = await Media.create({
      title,
      imageUrl,
      embedUrl,
      description,
      type,
      genre,
      subtitle,
      releaseDate,
      duration,
      propImageUrl,
      rating,
    });
    res.status(200).json({ msg: "สำเร็จ", media: mediaDoc });
  } catch (err) {
    return res.status(404).json({ msg: err, error: true });
  }
};

export const getMedia: RequestHandler = async (req, res) => {
  const { path } = req.params;
  try {
    const mediaDoc = await Media.findOne({ path });
    if (!mediaDoc) {
      return res.status(404).json({ msg: "ไม่พบรายการ" });
    }
    res.status(200).json({ media: mediaDoc });
  } catch (err) {
    return res.status(404).json({ msg: err });
  }
};

export const getAllMedia: RequestHandler = async (req, res) => {
  let { page = 1, maxPerPage, type, genre, keyword } = req.query;
  const skip = (Number(page) - 1) * Number(maxPerPage);
  try {
    let mediaDoc;
    if (type && genre) {
      mediaDoc = await Media.find({ type, genre: { $in: [genre] } })
        .sort({ releaseDate: -1 })
        .skip(skip)
        .limit(Number(maxPerPage));
    } else if (keyword) {
      let transformedKeyword;
      let regexKeyword;
      if (keyword.toString().includes("$20")) {
        console.log("มีช่องว่าง");
        transformedKeyword = keyword.toString().replace(/%20/g, " ");
        regexKeyword = new RegExp(transformedKeyword, "i");
      } else if (keyword.toString().length > 3) {
        transformedKeyword = keyword.toString().slice(0, 4);
        regexKeyword = new RegExp(transformedKeyword, "i");
      } else {
        regexKeyword = new RegExp(keyword.toString(), "i");
      }
      mediaDoc = await Media.find({ title: regexKeyword })
        .skip(skip)
        .limit(Number(maxPerPage));
    } else if (type) {
      mediaDoc = await Media.find({ type })
        .sort({ releaseDate: -1 })
        .skip(skip)
        .limit(Number(maxPerPage));
    } else {
      mediaDoc = await Media.find()
        .sort({ releaseDate: -1 })
        .skip(skip)
        .limit(Number(maxPerPage));
    }
    return res.status(200).json({ media: mediaDoc });
  } catch (err) {
    return res.status(404).json({ error: err });
  }
};

export const getLatestMedia: RequestHandler = async (req, res) => {
  let { type, limit } = req.query;
  if (!type) {
    type = "movie";
  }
  try {
    const newMediaDoc = await Media.find({ type })
      .sort({ releaseDate: -1 })
      .limit(Number(limit));
    res.status(200).json({ media: newMediaDoc });
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

export const getRandomMedia: RequestHandler = async (req, res) => {
  const { size, currentPath } = req.query;
  if (!size) {
    return res.status(404).json({ msg: "ไม่ได้กำหนด size" });
  }
  try {
    const mediaDoc = await Media.aggregate([
      { $match: { path: { $ne: currentPath } } },
      { $sample: { size: Number(size) } },
    ]);
    res.status(200).json({ media: mediaDoc });
  } catch (err) {
    return res.status(404).json({ error: err });
  }
};

export const getMediaByGenre: RequestHandler = async (req, res) => {
  const { type, genre } = req.query;
  try {
    const mediaDoc = await Media.find({ type, genre: { $in: [genre] } });
    res.status(200).json({ media: mediaDoc });
  } catch (err) {
    res.status(404).json({ error: err });
  }
};
