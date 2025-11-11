# Backend Server

Bu backend server Node.js və Express.js istifadə edərək qurulmuşdur. MongoDB verilənlər bazası ilə inteqrasiya edilmişdir.

## 📋 Tələblər

- Node.js (v18 və ya daha yeni)
- MongoDB (local və ya cloud - MongoDB Atlas)
- npm və ya yarn

## 🚀 Quraşdırma

### 1. Dependencies-ləri quraşdırın

```bash
npm install
```

### 2. Environment Variables

`.env` faylı yaradın və aşağıdakı dəyişənləri əlavə edin:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Serveri işə salın

Development rejimində işə salmaq üçün:

```bash
npm run dev
```

Production rejimində işə salmaq üçün:

```bash
npm start
```

Server default olaraq `http://localhost:5000` ünvanında işləyəcək.

## ⚠️ ƏHƏMİYYƏTLİ

**Bu serveri işə salmaq mütləqdir!** Server işə salınmadan frontend düzgün işləməyəcək.

Server uğurla işə salındıqdan sonra frontend URL-ə (`http://localhost:3000` və ya frontend ünvanına) gedə bilərsiniz.

## 📡 API Endpoints

- `GET /api/content` - Bütün kontentləri əldə et
- `POST /api/content` - Yeni kontent əlavə et
- `GET /api/content/:id` - Müəyyən kontenti əldə et
- `PUT /api/content/:id` - Kontenti yenilə
- `DELETE /api/content/:id` - Kontenti sil

## 🏗️ Proyekt Strukturu

```
backend/
├── api/
│   └── index.js          # Vercel serverless function
├── config/
│   └── cloudinary.js     # Cloudinary konfiqurasiyası
├── controller/
│   └── contentController.js  # Content controller
├── lib/
│   └── db.js             # MongoDB bağlantısı
├── models/
│   └── Content.js        # Content model
├── routes/
│   └── contentRoutes.routes.js  # Content routes
├── uploads/              # Upload edilmiş fayllar
├── server.js             # Local development server
├── package.json
└── vercel.json           # Vercel konfiqurasiyası
```

## 🔧 Scripts

- `npm start` - Serveri production rejimində işə salır
- `npm run dev` - Serveri development rejimində işə salır (nodemon ilə)


