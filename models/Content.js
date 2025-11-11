import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, enum: ["News", "Announcement"], required: true },
    coverImage: { type: String },
    htmlContent: { type: String },
    activeLang: { type: String, default: "EN" },
    galleryImages: [{ type: String }],
    author: { type: String },
    publishStatus: {
      type: String,
      enum: ["Publish", "Draft"],
      default: "Publish",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Content = mongoose.model("Content", contentSchema);
export default Content;
