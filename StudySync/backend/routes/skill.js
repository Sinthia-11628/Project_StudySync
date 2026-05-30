const express = require("express");
const Skill = require("../models/Skill");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, level, description } = req.body;

    if (!name || !level || !description) {
      return res.status(400).json({ message: "All skill fields are required" });
    }

    const skill = await Skill.create({ name, level, description });
    res.status(201).json(skill);
  } catch (err) {
    console.error("CREATE SKILL ERROR:", err);
    res.status(500).json({ message: err.message || "Skill creation failed" });
  }
});

router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json(skills);
  } catch (err) {
    console.error("GET SKILLS ERROR:", err);
    res.status(500).json({ message: err.message || "Failed to fetch skills" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: "Skill deleted" });
  } catch (err) {
    console.error("DELETE SKILL ERROR:", err);
    res.status(500).json({ message: err.message || "Failed to delete skill" });
  }
});

module.exports = router;
