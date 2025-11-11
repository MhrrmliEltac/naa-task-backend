import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB bağlantısı uğurla quruldu.");
  } catch (err) {
    console.error("❌ MongoDB bağlantı xətası:", err);
    throw new Error("MongoDB bağlantısı uğursuz oldu.");
  }
};

export default connectDB;
