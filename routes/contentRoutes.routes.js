import express from "express";
import {
  createContent,
  deleteContent,
  getContents,
  updateContent,
} from "../controller/contentController.js";
import multer from "multer";

const router = express.Router();

// Memory storage for serverless environments (Vercel)
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
