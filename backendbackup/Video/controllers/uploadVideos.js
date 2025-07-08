const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = process.env.FILE_UPLOAD_PATH || "./public/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `videos-${Date.now()}-${file.originalname}`);
  },
});

function sanitizeFile(file, cb) {
  const fileExts = [".mp4", ".avi", ".mov"];
  const isAllowedExt = fileExts.includes(path.extname(file.originalname.toLowerCase()));
  const isAllowedMimeType = file.mimetype.startsWith("video/");

  if (isAllowedExt && isAllowedMimeType) {
    return cb(null, true);
  } else {
    cb("Error: File type not allowed!");
  }
}

const uploadVideo = multer({
  storage: diskStorage,
  limits: {
    fileSize: 1024 * 1024 * 500, // 500mb file size
  },
  fileFilter: (req, file, cb) => {
    sanitizeFile(file, cb);
  }
});

module.exports = uploadVideo;