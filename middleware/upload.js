import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Store in memory first — we compress with sharp before writing to disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log("Uploading file:", file.originalname, file.mimetype);

  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/x-png",
    "image/webp",
    "image/gif",
  ];

  const allowedExt = [".jpeg", ".jpg", ".png", ".webp", ".gif"];
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = (file.mimetype || "").toLowerCase();

  if (allowedMimeTypes.includes(mimetype) && allowedExt.includes(ext)) {
    return cb(null, true);
  }

  cb(new Error(`Rejected "${file.originalname}" (mimetype: ${file.mimetype}) - only jpg, jpeg, png, webp, gif are allowed`));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadDirPath = uploadDir;
export default upload;