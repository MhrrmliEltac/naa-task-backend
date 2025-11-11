import express from "express";
import {
  createContent,
  deleteContent,
  getContents,
  updateContent,
} from "../controller/contentController.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Serverless environments (like Vercel) require /tmp directory for file uploads
// Use /tmp in production/serverless, uploads/ in development
const uploadDir = process.env.VERCEL || process.env.NODE_ENV === "production" 
  ? "/tmp" 
  : path.join(process.cwd(), "uploads");

const upload = multer({ dest: uploadDir });

router.get("/", getContents);
router.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  createContent
);
router.put(
  "/:id",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  updateContent
);
router.delete("/:id", deleteContent);

export default router;
