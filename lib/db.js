import mongoose from "mongoose";

const connectDB = async (retries = 3) => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const baseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  };

  // SSL xətası üçün alternativ konfiqurasiyalar
  const sslOptions = {
    ...baseOptions,
    tlsAllowInvalidCertificates: true, // SSL xətası üçün
  };

  // Əvvəlcə normal seçimlərlə cəhd et
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGO_URI, baseOptions);
      console.log("✅ MongoDB bağlantısı uğurla quruldu.");
      return;
    } catch (err) {
      const isSSLError = err.message?.includes('SSL') || 
                        err.message?.includes('TLS') || 
                        err.cause?.code === 'ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR';
      
      if (isSSLError && i === 0) {
        // SSL xətası varsa, SSL seçimləri ilə cəhd et
        console.log("⚠️ SSL xətası aşkar edildi. Alternativ SSL konfiqurasiyası ilə cəhd edilir...");
        try {
          await mongoose.connect(process.env.MONGO_URI, sslOptions);
          console.log("✅ MongoDB bağlantısı SSL seçimləri ilə uğurla quruldu.");
          return;
        } catch (sslErr) {
          console.error(`❌ SSL seçimləri ilə də uğursuz oldu:`, sslErr.message);
        }
      }
      
      console.error(`❌ MongoDB bağlantı xətası (cəhd ${i + 1}/${retries}):`, err.message);
      
      if (i === retries - 1) {
        console.error("❌ Bütün cəhdlər uğursuz oldu. Xəta detalları:", err);
        throw new Error("MongoDB bağlantısı uğursuz oldu.");
      }
      
      // Gözlə və yenidən cəhd et
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

export default connectDB;
