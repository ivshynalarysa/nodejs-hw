import { Schema, model } from "mongoose";
import TAGS from '../constants/tags.js';

const noteSchema = new Schema(
  {
  title: {
    type: String,
      required: true,
      trim: true, // прибирає пробіли на початку та в кінці
  },
  content: {
    type: String,
    default: "",
    trim: true,
  },
    tag: {
      type: String,

      enum: TAGS,
      default: "Todo",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }

);

noteSchema.index({ tag: "text", content: "text", search: "text" });

export const Note = model("Note", noteSchema);
