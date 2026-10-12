import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, "../temp");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
        cb(null,true)
    } else {
        cb(new Error("Only pdf and Images are allowed"))
    }
};

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});
