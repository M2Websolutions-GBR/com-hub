const asyncHandler = require('@comhub/middleware/async')
const ErrorResponse = require('@comhub/middleware/errorResponse')
const Comment = require('../models/Comment')
const Video = require('../models/Video')

// @desc    Get comments
// @route   GET /api/data/comments
// @access  Private
exports.getComments = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc    Get comments by video id
// @route   GET /api/data/comments/:videoId/videos
// @access  Public
exports.getCommentByVideoId = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ videoId: req.params.videoId })
    .populate('userId')
    .populate('replies')
    .sort('-createdAt')

  if (!comments) {
    return next(
      new ErrorResponse(
        `No comment with that video id of ${req.params.videoId}`
      )
    )
  }

  res.status(200).json({ sucess: true, data: comments })
})

// @desc    Create comment
// @route   POST /api/data/comments/
// @access  Private
exports.createComment = asyncHandler(async (req, res, next) => {
  console.log(req.body.videoId)
  let video = await Video.findById({
    _id: req.body.videoId,
    status: 'public'
  })

  if (!video) {
    return next(
      new ErrorResponse(`No video with id of ${req.body.videoId}`, 404)
    )
  }
  const comment = await Comment.create({
    ...req.body,
    userId: req.user.id
  })

  return res.status(200).json({ sucess: true, data: comment })
})

// @desc    Update comment
// @route   PUT /api/data/comments/:id
// @access  Private
exports.updateComment = asyncHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id).populate('videoId')

  if (!comment) {
    return next(
      new ErrorResponse(`No comment with id of ${req.params.id}`, 404)
    )
  }

  if (
    comment.userId.toString() == req.user.id.toString() ||
    comment.videoId.userId.toString() == req.user.id.toString()
  ) {
    comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    res.status(200).json({ success: true, data: comment })
  } else {
    return next(
      new ErrorResponse(`You are not authorized to update this comment`, 400)
    )
  }
})

// @desc    Delete comment
// @route   DELETE /api/data/comments/:id
// @access  Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id).populate('videoId')

  if (!comment) {
    return next(
      new ErrorResponse(`No comment with id of ${req.params.id}`, 404)
    )
  }

  if (
    comment.userId.toString() == req.user.id.toString() ||
    comment.videoId.userId.toString() == req.user.id.toString()
  ) {
    await Comment.findByIdAndDelete(req.params.id)
  } else {
    return next(
      new ErrorResponse(`You are not authorized to delete this comment`, 400)
    )
  }

  return res.status(200).json({ success: true, comment })
})
