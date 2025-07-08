const mongoose = require("mongoose");

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
