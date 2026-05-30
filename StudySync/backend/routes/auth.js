const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const upload = require("../middleware/upload");
const User = require("../models/User");

const router = express.Router();

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const generateResetCode = () => {
  // Securely generate a 6-digit OTP (000000 - 999999)
  const n = crypto.randomInt(0, 1000000);
  return n.toString().padStart(6, "0");
};

const getResetEmailTransporter = () => {
  if (
    process.env.EMAIL_HOST &&
    process.env.EMAIL_PORT &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS
  ) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return null;
};

const sendResetCodeEmail = async (email, code) => {
  let transporter = getResetEmailTransporter();
  const fromAddress =
    process.env.EMAIL_FROM ||
    process.env.EMAIL_USER ||
    "no-reply@studysync.app";

  // If transporter not configured via env, create an Ethereal test account
  // so emails are still sent during development and a preview URL is produced.
  let usedTestAccount = false;
  let testInfo = null;

  if (!transporter) {
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      usedTestAccount = true;
    } catch (err) {
      console.error("Failed to create Ethereal test account:", err);
    }
  }

  if (!transporter) {
    // Last resort: log the code so frontend flow can be tested
    console.log(`Password reset code for ${email}: ${code}`);
    return;
  }

  try {
    testInfo = await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: "StudySync Password Reset Code",
      text: `Your StudySync password reset code is ${code}. It expires in 15 minutes.`,
      html: `<p>Your StudySync password reset code is <strong>${code}</strong>.</p><p>This code expires in 15 minutes.</p>`,
    });

    if (usedTestAccount && testInfo) {
      const preview = nodemailer.getTestMessageUrl(testInfo);
      console.log(`Password reset email (Ethereal) for ${email}: ${preview}`);
    }
  } catch (err) {
    console.error("Error sending reset email:", err);
  }
};

router.post("/register", upload.single("pic"), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // Validate required fields
    const requiredFields = [
      "name",
      "username",
      "varsity",
      "varsityId",
      "dept",
      "batch",
      "email",
      "phone",
      "password",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
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
      password,
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
      profilePic,
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
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    console.log("ERROR DETAILS:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    res.status(500).json({
      message: "Registration failed",
      error: error.message,
      details: error.toString(),
    });
  }
});

router.put("/update", upload.single("pic"), async (req, res) => {
  try {
    const {
      id,
      name,
      username,
      varsity,
      varsityId,
      dept,
      batch,
      email,
      phone,
      currentPassword,
      newPassword,
    } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User id is required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (
      (currentPassword && !newPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        message:
          "To change your password, provide both currentPassword and newPassword",
      });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({
          message: "New password must be at least 8 characters long",
        });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    if (username && username !== user.username) {
      const usernameTaken = await User.findOne({ username });
      if (usernameTaken) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    user.name = name || user.name;
    user.username = username || user.username;
    user.varsity = varsity || user.varsity;
    user.varsityId = varsityId || user.varsityId;
    user.dept = dept || user.dept;
    user.batch = batch || user.batch;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    if (req.file) {
      let profilePic = "";
      if (req.file.path && req.file.path.includes("cloudinary")) {
        profilePic = req.file.path || req.file.url || "";
      } else if (req.file.filename) {
        profilePic = `/uploads/${req.file.filename}`;
      } else {
        profilePic = req.file.path || req.file.location || req.file.url || "";
      }
      user.profilePic = profilePic;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
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
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error);
    res.status(500).json({
      message: "Profile update failed",
      error: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;
    const identifier = typeof email === "string" ? email.trim() : "";

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Email or username and password are required" });
    }

    const normalized = escapeRegExp(identifier);

    const user = await User.findOne({
      $or: [
        { email: { $regex: `^${normalized}$`, $options: "i" } },
        { username: { $regex: `^${normalized}$`, $options: "i" } },
      ],
    });
    console.log("LOGIN USER FOUND:", user ? user.email || user.username : null);

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
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.trim();
    const user = await User.findOne({
      email: { $regex: `^${escapeRegExp(normalizedEmail)}$`, $options: "i" },
    });

    if (!user) {
      return res.status(200).json({
        message:
          "If an account exists for that email, a reset code has been sent.",
      });
    }

    const resetCode = generateResetCode();
    // Store hashed OTP and set a 5-minute expiry
    user.passwordResetCode = await bcrypt.hash(resetCode, 10);
    user.passwordResetExpires = Date.now() + 1000 * 60 * 5;
    await user.save();

    await sendResetCodeEmail(user.email, resetCode);

    const responseBody = {
      message:
        "If an account exists for that email, a reset code has been sent.",
    };

    // For development convenience, include the plain reset code in the response
    // when not in production. This assists frontend testing without SMTP.
    if (process.env.NODE_ENV !== "production") {
      responseBody.resetCode = resetCode;
    }

    res.json(responseBody);
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({
      message: "Unable to process password reset request",
      error: error.message,
    });
  }
});

router.post("/verify-reset-code", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const normalizedEmail = email.trim();
    const user = await User.findOne({
      email: { $regex: `^${escapeRegExp(normalizedEmail)}$`, $options: "i" },
    });

    if (
      !user ||
      !user.passwordResetCode ||
      !user.passwordResetExpires ||
      Date.now() > user.passwordResetExpires
    ) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    const isValidCode = await bcrypt.compare(code, user.passwordResetCode);
    if (!isValidCode) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    res.json({ message: "Reset code verified successfully" });
  } catch (error) {
    console.error("VERIFY RESET CODE ERROR:", error);
    res.status(500).json({
      message: "Unable to verify reset code",
      error: error.message,
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({
        message: "Email, code, and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters long",
      });
    }

    const normalizedEmail = email.trim();
    const user = await User.findOne({
      email: { $regex: `^${escapeRegExp(normalizedEmail)}$`, $options: "i" },
    });

    if (
      !user ||
      !user.passwordResetCode ||
      !user.passwordResetExpires ||
      Date.now() > user.passwordResetExpires
    ) {
      return res.status(400).json({ message: "Invalid or expired reset code" });
    }

    const isValidCode = await bcrypt.compare(code, user.passwordResetCode);
    if (!isValidCode) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, 10);

    // Cleanup reset fields and invalidate previous sessions
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.sessionsInvalidBefore = Date.now();
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({
      message: "Unable to reset password",
      error: error.message,
    });
  }
});

module.exports = router;
