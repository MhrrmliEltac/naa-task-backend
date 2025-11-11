import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contentRoutes from "./routes/contentRoutes.routes.js";
import connectDb from "./lib/db.js";

dotenv.config();

const app = express();

// Middleware-lər
app.use(cors());
app.use(express.json());

// Database connection middleware - connects on first request
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
  res.json({ message: "Server is running" });
});

// Only start server in local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log("server ugurla isledi");
  });
}

// Vercel üçün export
export default app;
