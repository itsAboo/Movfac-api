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
exports.getMediaByGenre = exports.getRandomMedia = exports.getLatestMedia = exports.getAllMedia = exports.getMedia = exports.addMedia = void 0;
const media_1 = __importDefault(require("../models/media"));
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
const addMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, imageUrl, embedUrl, description, type, genre, subtitle, releaseDate, duration, rating, propImageUrl, } = req.body;
    if (!(title &&
        imageUrl &&
        embedUrl &&
        description &&
        type &&
        genre &&
        subtitle &&
        releaseDate &&
        duration &&
        propImageUrl)) {
        res.status(404).json({ msg: "ข้อมูลไม่ครบ", error: true });
        return;
    }
    try {
        const mediaDoc = yield media_1.default.create({
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
    }
    catch (err) {
        return res.status(404).json({ msg: err, error: true });
    }
});
exports.addMedia = addMedia;
const getMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { path } = req.params;
    try {
        const mediaDoc = yield media_1.default.findOne({ path });
        if (!mediaDoc) {
            return res.status(404).json({ msg: "ไม่พบรายการ" });
        }
        res.status(200).json({ media: mediaDoc });
    }
    catch (err) {
        return res.status(404).json({ msg: err });
    }
});
exports.getMedia = getMedia;
const getAllMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { page = 1, maxPerPage, type, genre, keyword } = req.query;
    const skip = (Number(page) - 1) * Number(maxPerPage);
    try {
        let mediaDoc;
        if (type && genre) {
            mediaDoc = yield media_1.default.find({ type, genre: { $in: [genre] } })
                .sort({ releaseDate: -1 })
                .skip(skip)
                .limit(Number(maxPerPage));
        }
        else if (keyword) {
            let transformedKeyword;
            let regexKeyword;
            if (keyword.toString().includes("$20")) {
                console.log("มีช่องว่าง");
                transformedKeyword = keyword.toString().replace(/%20/g, " ");
                regexKeyword = new RegExp(transformedKeyword, "i");
            }
            else if (keyword.toString().length > 3) {
                transformedKeyword = keyword.toString().slice(0, 4);
                regexKeyword = new RegExp(transformedKeyword, "i");
            }
            else {
                regexKeyword = new RegExp(keyword.toString(), "i");
            }
            mediaDoc = yield media_1.default.find({ title: regexKeyword })
                .skip(skip)
                .limit(Number(maxPerPage));
        }
        else if (type) {
            mediaDoc = yield media_1.default.find({ type })
                .sort({ releaseDate: -1 })
                .skip(skip)
                .limit(Number(maxPerPage));
        }
        else {
            mediaDoc = yield media_1.default.find()
                .sort({ releaseDate: -1 })
                .skip(skip)
                .limit(Number(maxPerPage));
        }
        return res.status(200).json({ media: mediaDoc });
    }
    catch (err) {
        return res.status(404).json({ error: err });
    }
});
exports.getAllMedia = getAllMedia;
const getLatestMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { type, limit } = req.query;
    if (!type) {
        type = "movie";
    }
    try {
        const newMediaDoc = yield media_1.default.find({ type })
            .sort({ releaseDate: -1 })
            .limit(Number(limit));
        res.status(200).json({ media: newMediaDoc });
    }
    catch (err) {
        res.status(404).json({ error: err });
    }
});
exports.getLatestMedia = getLatestMedia;
const getRandomMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { size, currentPath } = req.query;
    if (!size) {
        return res.status(404).json({ msg: "ไม่ได้กำหนด size" });
    }
    try {
        const mediaDoc = yield media_1.default.aggregate([
            { $match: { path: { $ne: currentPath } } },
            { $sample: { size: Number(size) } },
        ]);
        res.status(200).json({ media: mediaDoc });
    }
    catch (err) {
        return res.status(404).json({ error: err });
    }
});
exports.getRandomMedia = getRandomMedia;
const getMediaByGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, genre } = req.query;
    try {
        const mediaDoc = yield media_1.default.find({ type, genre: { $in: [genre] } });
        res.status(200).json({ media: mediaDoc });
    }
    catch (err) {
        res.status(404).json({ error: err });
    }
});
exports.getMediaByGenre = getMediaByGenre;
