import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable təyin edilməyib!");
    }

    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
     
    };

    await mongoose.connect(mongoUri, options);
    console.log("✅ MongoDB bağlantısı uğurla quruldu.");
  } catch (err) {
    console.error("❌ MongoDB bağlantı xətası:", err);
    console.error("\nYoxlayın:");
    console.error("1. MONGO_URI düzgün formatdadır?");
    console.error("2. MongoDB server işləyir?");
    console.error("3. Network/firewall problemi varmı?");
    console.error("4. Connection string-də SSL parametrləri düzgündür?");
    throw new Error("MongoDB bağlantısı uğursuz oldu.");
  }
};

export default connectDB;
