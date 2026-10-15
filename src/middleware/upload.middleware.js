import multer from "multer";
import path from "node:path";
import fs from "node:fs";

export function createUploadMiddleware({
  destination = "uploads",
  allowedExtensions = [".csv", ".xlsx"],
  maxFileSizeMB = 20,
  maxFiles = 1,
  fieldName = "file",
} = {}) {
  const uploadDir = path.resolve(process.cwd(), destination);

  fs.mkdirSync(uploadDir, { recursive: true });

  const storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, uploadDir);
    },
    filename(req, file, callback) {
      const extension = path.extname(file.originalname).toLowerCase();
      const uniqueName = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

      callback(null, uniqueName);
    },
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: maxFileSizeMB * 1024 * 1024,
      files: maxFiles,
    },
    fileFilter(req, file, callback) {
      const extension = path.extname(file.originalname).toLowerCase();

      if (!allowedExtensions.includes(extension)) {
        return callback(
          new Error(
            `Only ${allowedExtensions.join(", ")} files are allowed`
          )
        );
      }

      callback(null, true);
    },
  });

  return upload.single(fieldName);
}