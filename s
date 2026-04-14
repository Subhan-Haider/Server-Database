const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();

app.use(cors());

// 🔐 API KEY (change if you want)
const API_KEY = "202620252009sh";

// 📦 Storage location on your server
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/var/www/storage/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// 📤 Upload settings
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// 🌍 Upload API (SECURED)
app.post("/upload", upload.single("file"), (req, res) => {
  const token = req.headers.authorization;

  // ❌ Security check
  if (token !== API_KEY) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  // ❌ if no file
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // ✅ return DOMAIN URL (IMPORTANT FIX)
  res.json({
    url: `https://storage.lootops.me/uploads/${req.file.filename}`,
    filename: req.file.filename,
    type: req.file.mimetype,
    size: req.file.size
  });
});

// 🧪 Test route
app.get("/", (req, res) => {
  res.send("🚀 Storage server is running");
});

// 🚀 Listen on all interfaces
app.listen(5000, "0.0.0.0", () => {
  console.log("🚀 Server running on port 5000");
});
