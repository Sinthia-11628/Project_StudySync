const express = require("express");
const bcrypt = require("bcryptjs");
const upload = require("../middleware/upload");
const User = require("../models/User");

const router = express.Router();

router.post("/register", upload.single("pic"), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // Validate required fields
    const requiredFields = ['name', 'username', 'varsity', 'varsityId', 'dept', 'batch', 'email', 'phone', 'password'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: "Missing required fields", 
        missingFields 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const {
      name,
      username,
      varsity,
      varsityId,
      dept,
      batch,
      email,
      phone,
      password
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePic = "";
    if (req.file) {
      // For Cloudinary storage
      if (req.file.path && req.file.path.includes("cloudinary")) {
        profilePic = req.file.path || req.file.url || "";
      }
      // For local disk storage
      else if (req.file.filename) {
        profilePic = `/uploads/${req.file.filename}`;
      }
      // Fallback
      else {
        profilePic = req.file.path || req.file.location || req.file.url || "";
      }
    }

    const user = new User({
      name,
      username,
      varsity,
      varsityId,
      dept,
      batch,
      email,
      phone,
      password: hashedPassword,
      profilePic
    });

    await user.save();

    res.json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        varsity: user.varsity,
        varsityId: user.varsityId,
        dept: user.dept,
        batch: user.batch,
        phone: user.phone,
        profilePic: user.profilePic
      }
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);
    console.log("ERROR DETAILS:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    res.status(500).json({
      message: "Registration failed",
      error: error.message,
      details: error.toString()
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        varsity: user.varsity,
        varsityId: user.varsityId,
        dept: user.dept,
        batch: user.batch,
        phone: user.phone,
        profilePic: user.profilePic
      }
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});

module.exports = router;