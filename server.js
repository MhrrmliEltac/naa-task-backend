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

// Routes
app.use("/api/content", contentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    message: "Server error",
    error: err.message,
  });
});

// Unhandled promise rejection handler
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

// Uncaught exception handler
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Start server with database connection
const startServer = async () => {
  try {
    await connectDb();
    app.listen(5000, () => {
      console.log("server ugurla isledi");
    });
  } catch (error) {
    console.error("Server başlatılamadı:", error);
    process.exit(1);
  }
};

startServer();

// Vercel üçün export
export default app;
