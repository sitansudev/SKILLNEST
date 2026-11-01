import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import multer from "multer";

const uploadDirectory = path.resolve("uploads/notes");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, uploadDirectory),

  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${extension}`;
    callback(null, uniqueName);
  }
});

function fileFilter(req, file, callback) {
  if (file.mimetype !== "application/pdf") {
    return callback(new Error("Only PDF files are allowed"));
  }

  callback(null, true);
}

export const uploadNotePdf = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024
  }
});
