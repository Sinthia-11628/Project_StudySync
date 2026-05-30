const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },

    varsity: {
      type: String,
      required: true,
    },

    varsityId: {
      type: String,
      required: true,
    },

    dept: {
      type: String,
      required: true,
    },

    batch: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    passwordResetCode: {
      type: String,
    },

    passwordResetExpires: {
      type: Date,
    },

    // Timestamp used to invalidate existing sessions/tokens issued before this time
    sessionsInvalidBefore: {
      type: Date,
    },

    profilePic: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
