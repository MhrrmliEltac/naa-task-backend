import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";
import contentRoutes from "./routes/contentRoutes.routes.js";
import connectDb from "./lib/db.js";

dotenv.config();
const app = express();
connectDb();

// Middleware-lər
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/content", contentRoutes);

app.listen(5000, () => {
  console.log("server ugurla isledi");
});

// Vercel üçün export
export const handler = serverless(app);
