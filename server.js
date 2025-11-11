import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contentRoutes from "./routes/contentRoutes.routes.js";
import connectDb from "./lib/db.js";
import serverless from "serverless-http";

dotenv.config();

const app = express();

// Middleware-lər
app.use(cors());
app.use(express.json());

// Database connection middleware - lazy connection for serverless
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ 
      message: "Database connection failed", 
      error: error.message 
    });
  }
});

// Routes
app.use("/api/content", contentRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ 
    message: "Internal server error", 
    error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong" 
  });
});

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(5000, async () => {
    await connectDb();
    console.log("server ugurla isledi");
  });
}

// Vercel üçün export - serverless wrapper
export default serverless(app);
