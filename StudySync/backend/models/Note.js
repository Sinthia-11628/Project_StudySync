const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: String,
  subject: String,
  description: String,
  fileUrl: String,
  fileName: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  status: { type: String, default: "saved", enum: ["saved", "modified"] },
});

module.exports = mongoose.model("Note", noteSchema);