import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import serverless from "serverless-http";

import contentRoutes from "./routes/contentRoutes.routes.js";

dotenv.config();

const app = express();

// Middleware-lər
app.use(cors());
app.use(express.json());

// MongoDB-yə qoşulma
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/content", contentRoutes);

// Vercel üçün export
export const handler = serverless(app);
