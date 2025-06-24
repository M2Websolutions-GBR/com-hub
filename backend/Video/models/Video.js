const mongoose = require("mongoose");
const AWS = require("aws-sdk");
const s3 = require("../config/s3");

require("dotenv").config();

const VideoSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnailUrl: String,
  views: Number,
  key: String,
  status: String,
  categoryId: mongoose.Schema.ObjectId,
  userId: mongoose.Schema.ObjectId,
});

// VideoSchema.statics.upload = async (file) => {
//   const s3Client = s3();
//   const params = {
//     Bucket: process.env.BUCKET_NAME,
//     Key: `${Date.now()}-${file.originalname}`,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//     ACL: "private",
//   };

//   const data = await s3Client.upload(params).promise();
//   return data.Key;
// };

VideoSchema.index({ title: "text" });

VideoSchema.virtual("dislikes", {
  ref: "Feeling",
  localField: "_id",
  foreignField: "videoId",
  justOne: false,
  count: true,
  match: { type: "dislike" },
});

VideoSchema.virtual("likes", {
  ref: "Feeling",
  localField: "_id",
  foreignField: "videoId",
  justOne: false,
  count: true,
  match: { type: "like" },
});

VideoSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "videoId",
  justOne: false,
  count: true,
});

module.exports = mongoose.model("Video", VideoSchema);
