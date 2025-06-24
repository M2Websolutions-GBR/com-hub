const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require("path")

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const s3Storage = multerS3({
  s3: s3,
  bucket: process.env.BUCKET_NAME,
  acl: "private",
  key: (req, file, cb) => {
    cb(null, `videos/${Date.now()}-${file.originalname}`);
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
  storage: s3Storage,
  limits: {
    fileSize: 1024 * 1024 * 500, // 500mb file size
  },
  fileFilter: (req, file, cb) => {
    sanitizeFile(file, cb);
  }
});

module.exports = uploadVideo;