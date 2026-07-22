import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

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

export default upload;