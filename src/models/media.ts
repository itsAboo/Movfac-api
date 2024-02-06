import { Schema, model } from "mongoose";
import { dashString } from "../util/titleize";

const mediaSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

mediaSchema.pre("save", function () {
  this.path = dashString(this.title);
});

const Media = model("Movie", mediaSchema);

export default Media;
