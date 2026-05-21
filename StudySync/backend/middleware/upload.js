const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

let storage;
const hasCloudinary = cloudinary && typeof cloudinary.uploader === "function" && process.env.CLOUDINARY_NAME && process.env.CLOUDINARY_KEY && process.env.CLOUDINARY_SECRET;

if (hasCloudinary) {
  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "studysync_profiles",
      allowed_formats: ["jpg", "jpeg", "png"]
    }
  });
} else {
  console.warn("Cloudinary not configured or missing keys. Using local disk upload fallback.");
  const uploadDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, "-").toLowerCase();
      cb(null, `${basename}-${Date.now()}${ext}`);
    }
  });
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;