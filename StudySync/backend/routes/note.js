const express = require("express");
const axios = require("axios");
const path = require("path");

const Note = require("../models/Note");

const router = express.Router();

/*
CREATE NOTE
*/
router.post("/", async (req, res) => {
  try {
    const note = await Note.create({
      ...req.body,
      uploadedAt: req.body.uploadedAt || new Date(),
    });

    res.status(201).json(note);
  } catch (err) {
    console.error("CREATE NOTE ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/*
GET ALL NOTES
*/
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ uploadedAt: -1 });

    res.json(notes);
  } catch (err) {
    console.error("GET NOTES ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

/*
DELETE NOTE + STORAGE FILE
*/
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    /*
    DELETE FILE FROM STORAGE SERVER
    */

    if (note.fileUrl) {
      try {
        const fileName = path.basename(note.fileUrl);

        const STORAGE_SERVER =
          process.env.STORAGE_SERVER ||
          "http://host.docker.internal:9000";

        await axios.delete(
          `${STORAGE_SERVER}/delete/${fileName}`
        );

        console.log("Storage file deleted:", fileName);
      } catch (storageErr) {
        console.error(
          "STORAGE DELETE ERROR:",
          storageErr.message
        );
      }
    }

    /*
    DELETE MONGO METADATA
    */

    await Note.findByIdAndDelete(req.params.id);

    res.json({
      message: "Note and storage file deleted",
    });
  } catch (err) {
    console.error("DELETE NOTE ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;