require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 9000;
const HOST = process.env.HOST || "0.0.0.0";
const BASE_URL = process.env.PUBLIC_STORAGE_URL || `http://localhost:${PORT}`;

const CHUNK_DIR = path.join(__dirname, "chunks");
const UPLOAD_DIR = path.join(__dirname, "uploads");

fs.ensureDirSync(CHUNK_DIR);
fs.ensureDirSync(UPLOAD_DIR);

/*
CORS
Allow StudySync frontend
*/
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:8080",
      "http://localhost:3000"
    ],
    credentials: true
  })
);

app.use(express.json());

/*
Serve uploaded files
*/
app.use("/uploads", express.static(UPLOAD_DIR));

/*
Root
*/
app.get("/", (req, res) => {
  res.json({
    message: "Cloud Storage Server",
    status: "running"
  });
});

/*
Health check
*/
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    storage: "running"
  });
});

/*
Multer in memory
*/
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});

/*
UPLOAD CHUNK
*/
app.post("/upload-chunk", upload.single("chunk"), async (req, res) => {
  try {
    const { fileName, chunkIndex, totalChunks } = req.body;

    if (
      !fileName ||
      chunkIndex === undefined ||
      totalChunks === undefined ||
      !req.file
    ) {
      return res.status(400).json({
        message:
          "fileName, chunkIndex, totalChunks and chunk file are required"
      });
    }

    const safeFileName = path.basename(fileName);

    const chunkPath = path.join(
      CHUNK_DIR,
      `${safeFileName}.part_${chunkIndex}`
    );

    await fs.writeFile(chunkPath, req.file.buffer);

    console.log(
      `Chunk uploaded: ${safeFileName} part ${chunkIndex}/${Number(totalChunks) - 1}`
    );

    res.json({
      message: "Chunk uploaded",
      file: `${safeFileName}.part_${chunkIndex}`,
      chunkIndex: Number(chunkIndex),
      totalChunks: Number(totalChunks)
    });
  } catch (err) {
    console.error("UPLOAD CHUNK ERROR:", err);

    res.status(500).json({
      message: err.message
    });
  }
});

/*
MERGE CHUNKS
*/
app.post("/merge-chunks", async (req, res) => {
  try {
    const { fileName, totalChunks } = req.body;

    if (!fileName || totalChunks === undefined) {
      return res.status(400).json({
        message: "fileName and totalChunks are required"
      });
    }

    const safeFileName = path.basename(fileName);

    const finalPath = path.join(UPLOAD_DIR, safeFileName);

    const writeStream = fs.createWriteStream(finalPath);

    for (let i = 0; i < Number(totalChunks); i++) {
      const chunkPath = path.join(
        CHUNK_DIR,
        `${safeFileName}.part_${i}`
      );

      if (!fs.existsSync(chunkPath)) {
        writeStream.close();

        return res.status(400).json({
          message: `Chunk ${i} not found at ${chunkPath}`
        });
      }

      const data = await fs.readFile(chunkPath);

      writeStream.write(data);

      await fs.remove(chunkPath);
    }

    await new Promise((resolve, reject) => {
      writeStream.end();

      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    const fileUrl = `${BASE_URL}/uploads/${safeFileName}`;
    const downloadUrl = `${BASE_URL}/download/${safeFileName}`;

    console.log(`File merged: ${safeFileName}`);

    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.status(200).json({
      message: "File merged",
      fileUrl,
      downloadUrl,
      status: "success"
    });
  } catch (err) {
    console.error("MERGE ERROR:", err);

    res.status(500).json({
      message: err.message
    });
  }
});

/*
List uploaded files
Useful for debugging
*/
app.get("/files", async (req, res) => {
  const files = await fs.readdir(UPLOAD_DIR);

  res.json({
    files
  });
});

/*
Download a specific file
*/
app.get("/download/:fileName", async (req, res) => {
  try {
    const { fileName } = req.params;
    const safeFileName = path.basename(fileName);
    const filePath = path.join(UPLOAD_DIR, safeFileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "File not found"
      });
    }

    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.download(filePath, safeFileName);
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
});

/*
Get file metadata
*/
app.get("/file-info/:fileName", async (req, res) => {
  try {
    const { fileName } = req.params;
    const safeFileName = path.basename(fileName);
    const filePath = path.join(UPLOAD_DIR, safeFileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "File not found"
      });
    }

    const stats = await fs.stat(filePath);

    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.json({
      fileName: safeFileName,
      fileUrl: `${BASE_URL}/uploads/${safeFileName}`,
      downloadUrl: `${BASE_URL}/download/${safeFileName}`,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime
    });
  } catch (err) {
    console.error("FILE INFO ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
});

async function deleteUpload(fileName) {
  const safeFileName = path.basename(fileName);
  const filePath = path.join(UPLOAD_DIR, safeFileName);

  if (!fs.existsSync(filePath)) {
    const err = new Error("File not found");
    err.status = 404;
    throw err;
  }

  await fs.remove(filePath);

  const chunkPrefix = `${safeFileName}.part_`;
  const chunkFiles = await fs.readdir(CHUNK_DIR);
  await Promise.all(
    chunkFiles
      .filter((chunkName) => chunkName.startsWith(chunkPrefix))
      .map((chunkName) => fs.remove(path.join(CHUNK_DIR, chunkName)))
  );

  return safeFileName;
}

async function handleDeleteUpload(req, res) {
  try {
    const safeFileName = await deleteUpload(req.params.fileName);
    res.json({
      message: "File deleted",
      fileName: safeFileName
    });
  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({ message: err.message });
    }
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
}

app.delete("/uploads/:fileName", handleDeleteUpload);
app.delete("/files/:fileName", handleDeleteUpload);
app.delete("/delete/:fileName", handleDeleteUpload);

app.listen(PORT, HOST, () => {
  console.log(`Storage server running on ${HOST}:${PORT}`);
});