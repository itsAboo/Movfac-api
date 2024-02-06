"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const titleize_1 = require("../util/titleize");
const mediaSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        trim: true,
    },
    genre: {
        type: [String],
        required: true,
        trim: true,
    },
    subtitle: {
        type: String,
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    path: {
        type: String,
        default: "-",
    },
    embedUrl: {
        type: String,
        required: true,
    },
    propImageUrl: {
        type: String,
        default: null,
    },
}, { timestamps: true });
mediaSchema.pre("save", function () {
    this.path = (0, titleize_1.dashString)(this.title);
});
const Media = (0, mongoose_1.model)("Movie", mediaSchema);
exports.default = Media;
