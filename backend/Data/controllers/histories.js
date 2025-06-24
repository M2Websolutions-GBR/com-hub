const asyncHandler = require('@comhub/middleware/async');
const ErrorResponse = require('@comhub/middleware/errorResponse');
const History = require('../models/History');
const Video = require('../models/Video');

// @desc    Get Histories
// @route   GET /api/data/histories
// @access  Private
exports.getHistories = asyncHandler(async (req, res, next) => {
  const histories = await History.find({ userId: req.user.id, type: 'watch' }).populate('videoId');
  res.status(200).json({ success: true, data: histories });
});

// @desc    Create History
// @route   POST /api/data/histories/
// @access  Private
exports.createHistory = asyncHandler(async (req, res, next) => {
  if (req.body.type == 'watch') {
    const video = await Video.findById(req.body.videoId);
    if (!video) {
      return next(new ErrorResponse(`No video with that id of ${req.body.videoId}`));
    }
  }
  const history = await History.create({
    ...req.body,
    userId: req.user.id
  });

  return res.status(200).json({ success: true, data: history });
});

// @desc    Delete History
// @route   DELETE /api/data/histories/:id
// @access  Private
exports.deleteHistory = asyncHandler(async (req, res, next) => {
  let history = await History.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!history) {
    return next(new ErrorResponse(`No history with id of ${req.params.id}`, 404));
  }

  await History.findByIdAndDelete(req.params.id);

  return res.status(200).json({ success: true, data: {} });
});

// @desc    Delete Histories
// @route   DELETE /api/data/histories/:type/all
// @access  Private
exports.deleteHistories = asyncHandler(async (req, res, next) => {
  await History.deleteMany({
    type: req.params.type,
    userId: req.user.id
  });

  return res.status(200).json({ success: true, data: {} });
});
