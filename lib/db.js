import mongoose from "mongoose";

const connectDB = async () => {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Check if connection is in progress
  if (mongoose.connection.readyState === 2) {
    await new Promise((resolve) => {
      mongoose.connection.once("connected", resolve);
      mongoose.connection.once("error", resolve);
    });
    if (mongoose.connection.readyState === 1) {
      return;
    }
  }

  // Check if MONGO_URI is set
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not set");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log("✅ MongoDB bağlantısı uğurla quruldu.");
  } catch (err) {
    console.error("❌ MongoDB bağlantı xətası:", err);
    throw new Error(`MongoDB bağlantısı uğursuz oldu: ${err.message}`);
  }
};

export default connectDB;
