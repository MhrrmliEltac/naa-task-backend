import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";
import contentRoutes from "../routes/contentRoutes.routes.js";
import connectDb from "../lib/db.js";

dotenv.config();

const app = express();

// Middleware-lər
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
connectDb().catch((err) => {
  console.error("MongoDB bağlantı xətası:", err);
});

// Routes
app.use("/api/content", contentRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "API is running", status: "ok" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Vercel serverless function üçün export
export const handler = serverless(app);

// Local development üçün
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda işləyir`);
  });
}

export default app;

