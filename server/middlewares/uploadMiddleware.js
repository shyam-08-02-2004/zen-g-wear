import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = process.env.VERCEL ? '/tmp/uploads/' : 'uploads/';

// Ensure the temp upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  try {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create upload directory:', error);
  }
}

// Temporary local disk storage before pushing the file to Cloudinary
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Zen-G Wear accepts most common file types (documents, images, video, audio,
// archives) but blocks executables and scripts as a basic security measure.
const BLOCKED_EXTENSIONS = new Set([
  '.exe', '.msi', '.bat', '.cmd', '.sh', '.bin', '.dll', '.so',
  '.jar', '.com', '.scr', '.ps1', '.vbs', '.js', '.jsx', '.php',
]);

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (BLOCKED_EXTENSIONS.has(ext)) {
    return cb(new Error(`File type '${ext}' is not allowed for security reasons`));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB per file
    files: 10, // max 10 files per request
  },
  fileFilter,
});

export default upload;
