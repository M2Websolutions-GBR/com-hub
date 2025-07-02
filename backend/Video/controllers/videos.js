const Video = require("../models/Video");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");

const uploadDir = process.env.FILE_UPLOAD_PATH || "./public/uploads";

const transformKeyToThumbnailUrl = (filename) => {
  console.log("filename", filename)
  if (filename.endsWith(".mp4")) {
    return filename.replace(".mp4", "-0.jpg");
  }
  return filename;
}

exports.upload = async (req, res) => {
  try {
    const file = req.file;
    console.log("req.file:", file);
    console.log("req.body:", req.body);
    console.log("req.user:", req.user);

    if (!file) {
      return res.status(400).json({ message: "Kein File hochgeladen" });
    }

    const removeFileExtension = (filename) => {
      return filename.replace(/\.[^/.]+$/, "");
    };

    const name = removeFileExtension(file.originalname);
    const key = file.filename;
    const thumbnailUrl = transformKeyToThumbnailUrl(key);

    const video = new Video({
      userId: req.user.id,
      title: req.body.title || name,
      description: req.body.description,
      status: req.body.status,
      key: key,
      thumbnailUrl: `http://localhost:3002/thumbnails/${path.basename(thumbnailUrl)}`
    });

    await video.save();
    console.log("✅ Video wurde in die DB gespeichert:", video);

    // Dynamisch importieren und Thumbnail erstellen
    try {
      const { default: generateThumbnailsFromVideo } = await import("../Lambda-thumbs/src/generate-thumbnails-from-video.mjs");
      const videoPath = path.join(process.env.FILE_UPLOAD_PATH || "./public/uploads", file.filename);
      await generateThumbnailsFromVideo(videoPath, 1, file.filename);
      console.log("Thumbnail erfolgreich erstellt für:", file.filename);
    } catch (thumbnailErr) {
      console.error("Fehler bei der Thumbnail-Erstellung:", thumbnailErr);
    }

    res.send(video);
  } catch (err) {
    console.error("🚨 Fehler beim Speichern des Videos:", err);
    res.status(500).json({ message: 'Fehler beim Speichern in die DB', error: err });
  }
};



exports.uploadAvatar = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ success: false, message: 'Only image files are allowed!' });
    }

  const avatarFileName = `avatar-${Date.now()}-${file.originalname}`;
  const avatarPath = path.join(uploadDir, avatarFileName);
  fs.writeFileSync(avatarPath, file.buffer);

 const fieldsToUpdate = {
  avatarUrl: `http://localhost:3002/uploads/${avatarFileName}`,
};
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
    context: "query",
  });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.stream = async (req, res) => {
  const id = req.params.id;
  const video = await Video.findById(id);
  if (!video) return res.status(404).send("Video not found.");
  const filePath = path.join(uploadDir, video.key);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  res.sendFile(path.resolve(filePath));
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    // Find the video by ID
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const filePath = path.join(uploadDir, video.key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    // Delete from MongoDB
    await Video.findByIdAndDelete(id);

    res.status(204).json({ success: true });
  } catch (error) {
    console.error('Failed to delete video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
};

exports.updateVideoDetails = async (req, res) => {
  const { videoId, title, description } = req.body;

  try {
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    video.title = title;
    video.description = description;
    await video.save();

    // Return the updated video details
    res.status(200).json({
      success: true,
      title: video.title,
      description: video.description
    });
  } catch (error) {
    console.error("Error updating video details:", error);
    res.status(500).json({ error: "Error updating video details" });
  }
};
