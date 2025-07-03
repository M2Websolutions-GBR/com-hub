const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videos");
const { protect } = require('@comhub/middleware/auth')
const multer = require('multer');
const storage = multer.diskStorage();
const upload = multer({ storage });
const uploadVideo = require("../controllers/uploadVideos");


router.post("/upload", protect,uploadVideo.single("video"), videoController.upload);
router.delete("/:id/delete", protect, videoController.delete);
router.put("/uploadavatar", protect, upload.single("avatar"), videoController.uploadAvatar);
router.get(
  "/:id/stream",
  protect,
  videoController.stream
);
// Route to update video details
router.put("/updateDetails", protect, videoController.updateVideoDetails);

module.exports = router;
