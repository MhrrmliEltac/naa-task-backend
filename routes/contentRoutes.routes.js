import express from "express";
import {
  createContent,
  deleteContent,
  getContents,
  updateContent,
} from "../controller/contentController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large" });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ message: "Too many files" });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: "Unexpected file field" });
    }
    return res.status(400).json({ message: "File upload error", error: err.message });
  }
  if (err) {
    return res.status(400).json({ message: "File upload error", error: err.message });
  }
  next();
};

router.get("/", getContents);
router.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  handleMulterError,
  createContent
);
router.put(
  "/:id",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  handleMulterError,
  updateContent
);
router.delete("/:id", deleteContent);

export default router;
