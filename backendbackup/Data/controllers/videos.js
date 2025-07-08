const asyncHandler = require('@comhub/middleware/async')
const ErrorResponse = require('@comhub/middleware/errorResponse')

const Video = require('../models/Video')

// @desc    Get videos
// @route   GET /api/data/videos/public or /api/data/videos/private
// @access  Public Or Private
exports.getVideos = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc    Get single video
// @route   GET /api/data/videos/:id
// @access  Public
exports.getVideo = asyncHandler(async (req, res, next) => {
  const video = await Video.findById(req.params.id)
    .populate({
      path: 'categoryId'
    })
    .populate({ path: 'userId', select: 'channelName subscribers photoUrl' })
    .populate({ path: 'likes' })
    .populate({ path: 'dislikes' })
    .populate({ path: 'comments' })
  if (!video) {
    return next(new ErrorResponse(`No video with that id of ${req.params.id}`))
  }

  res.status(200).json({ sucess: true, data: video })
})

// Get all public videos by user ID
exports.getPublicVideosByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Find all public videos by user ID
    const videos = await Video.find({ userId, status: 'public' })
      .populate('userId')

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get all private videos by user ID
exports.getPrivateVideosByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Find all private videos by user ID
    const videos = await Video.find({ userId, status: 'private' })
      .populate('userId')

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update video
// @route   PUT /api/data/videos/:id
// @access  Private
exports.updateVideo = asyncHandler(async (req, res, next) => {
  const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  if (!video)
    return next(new ErrorResponse(`No video with that id of ${req.params.id}`))

  res.status(200).json({ success: true, data: video })
})

// @desc    Update video views
// @route   PUT /api/data/videos/:id/views
// @access  Public
exports.updateViews = asyncHandler(async (req, res, next) => {
  let video = await Video.findById(req.params.id)

  if (!video)
    return next(new ErrorResponse(`No video with that id of ${req.params.id}`))

  video.views++

  await video.save()

  res.status(200).json({ success: true, data: video })
})


