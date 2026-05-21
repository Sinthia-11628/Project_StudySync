require("dotenv").config();
const cloudinary = require("cloudinary").v2;

if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_KEY || !process.env.CLOUDINARY_SECRET) {
  console.error("Cloudinary environment variables are missing. Set CLOUDINARY_NAME, CLOUDINARY_KEY, and CLOUDINARY_SECRET.");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = cloudinary;