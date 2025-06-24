const Video = require("../models/Video");
const AWS = require("aws-sdk");
const User = require("../models/User");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
const s3 = new AWS.S3();

const transformKeyToThumbnailUrl = (filename) => {
  console.log("filename", filename)
  if (filename.endsWith(".mp4")) {
    return filename.replace(".mp4", "-0.jpg");
  }
  return filename;
}

exports.upload = async (req, res) => {
  const file = req.file;
  console.log("req", req.file);
  // Function to remove file extension
  const removeFileExtension = (filename) => {
    return filename.replace(/\.[^/.]+$/, "");
  };
  console.log("file",file.originalname);
  // Remove extension from original file name
  const name = removeFileExtension(file.originalname);
  
  const key = file.key
  const thumbnailUrl = transformKeyToThumbnailUrl(key);

  const video = new Video({
    userId: req.user.id,
    title: req.body.title || name,
    description: req.body.description,
    status: req.body.status,
    key: key,
    thumbnailUrl: `https://com-hub.s3.eu-central-1.amazonaws.com/thumbnails/${thumbnailUrl}`,
  });

  await video.save();
  res.send(video);
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

  const s3Client = new AWS.S3();
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `avatars/${Date.now().toString()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "private",
  };

  const data = await s3Client.upload(params).promise();

  const fieldsToUpdate = {
    avatarUrl: data.Location,
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

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: video.key,
    Expires: 3600 * 5 // URL expires in 5 hours (adjust as needed)
  };

  s3.getSignedUrl('getObject', params, (err, url) => {
    if (err) {
      console.error('Error generating presigned URL:', err);
      return res.status(500).json({ error: 'Error generating presigned URL' });
    }
    res.json({ video, url });
  });
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    // Find the video by ID
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Delete from AWS S3
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: video.key,
    };
    await s3.deleteObject(params).promise();

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
