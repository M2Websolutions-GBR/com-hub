const express = require('express')
const {
  getComments,
  getCommentByVideoId,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/comments')

const router = express.Router()

const advancedResults = require('@comhub/middleware/advancedResults')
const { protect } = require('@comhub/middleware/auth')
const Comment = require('../models/Comment')

router
  .route('/')
  .get(advancedResults(Comment, [
    { path: 'user', select: 'avatarUrl channelName' }, { path: 'replies' }
  ]), getComments)
  .post(protect, createComment)

router.route('/:id').put(protect, updateComment).delete(protect, deleteComment)

router.route('/:videoId/videos').get(getCommentByVideoId)

module.exports = router
