import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contentRoutes from "./routes/contentRoutes.routes.js";
import connectDb from "./lib/db.js";

dotenv.config();

connectDb();

const app = express();

// Middleware-lər
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/content", contentRoutes);

app.listen(5000, () => {
  console.log("server ugurla isledi");
});

// Vercel üçün export
export default app;
