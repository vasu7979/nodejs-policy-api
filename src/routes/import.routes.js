import express from "express";
import { createUploadMiddleware } from "../middleware/upload.middleware.js";
import { uploadFile } from "../controllers/import.controller.js";

const router = express.Router();

const uploadFileMiddleware = createUploadMiddleware({
  destination: "uploads",
  allowedExtensions: [".csv", ".xlsx"],
  maxFileSizeMB: 20,
  maxFiles: 1,
  fieldName: "file",
});

router.post("/upload", uploadFileMiddleware, uploadFile);

export default router;