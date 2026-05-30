require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/note");
const skillRoutes = require("./routes/skill");

const app = express();

// Updated CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:8080",
    ], // Add your frontend URLs
    credentials: true,
  }),
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/studysync";
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// test route
app.get("/", (req, res) => {
  res.send("StudySync API running");
});

// auth routes
app.use(["/api/auth", "/auth"], authRoutes);

// note routes
app.use("/api/notes", noteRoutes);

// skill routes
app.use("/api/skills", skillRoutes);

// global error handler (catches upload/route errors)
app.use((err, req, res, next) => {
  console.error("Express error middleware:", err);
  if (res.headersSent) {
    return next(err);
  }
  res
    .status(500)
    .json({ message: "Server error", error: err.message || "Unknown error" });
});

// start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
