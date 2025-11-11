import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";
import mongoose from "mongoose";
import contentRoutes from "../routes/contentRoutes.routes.js";
import connectDb from "../lib/db.js";

dotenv.config();

const app = express();

// Middleware-lər
app.use(cors());
app.use(express.json());

// Health check endpoints (before DB middleware)
app.get("/", (req, res) => {
  res.json({ 
    message: "API is running", 
    status: "ok",
    timestamp: new Date().toISOString(),
    dbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.get("/health", (req, res) => {
  res.json({ 
    message: "API is running", 
    status: "ok",
    timestamp: new Date().toISOString(),
    dbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// MongoDB bağlantısı - serverless üçün lazy connection
let connectionPromise = null;

const ensureDbConnection = async () => {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    return;
  }
  
  // If connection is in progress, wait for it
  if (connectionPromise) {
    return connectionPromise;
  }
  
  // Start new connection
  connectionPromise = (async () => {
    try {
      await connectDb();
      console.log("✅ Database connected");
      return true;
    } catch (err) {
      console.error("❌ MongoDB bağlantı xətası:", err);
      connectionPromise = null; // Reset to allow retry
      throw err;
    }
  })();
  
  return connectionPromise;
};

// Middleware to ensure DB connection before routes
app.use(async (req, res, next) => {
  try {
    await ensureDbConnection();
    next();
  } catch (err) {
    console.error("Database connection error in middleware:", err);
    res.status(503).json({
      message: "Service temporarily unavailable - database connection failed",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// Routes
app.use("/api/content", contentRoutes);

// 404 handler (must be after all routes)
app.use((req, res, next) => {
  res.status(404).json({
    message: "Route not found",
    path: req.path,
  });
});

// Error handling middleware (must be last, with 4 parameters)
app.use((err, req, res, next) => {
  console.error("Error:", err);
  // Don't send response if headers already sent
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Vercel serverless function üçün default export
const handler = serverless(app);

// Local development üçün
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  connectDb()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server ${PORT} portunda işləyir`);
      });
    })
    .catch((err) => {
      console.error("Failed to connect to database:", err);
    });
}

export default handler;

