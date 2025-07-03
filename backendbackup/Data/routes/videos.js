const express = require('express')
const {
  getVideos,
  getVideo,
  updateVideo,
  updateViews,
  getPublicVideosByUserId,
  getPrivateVideosByUserId
} = require('../controllers/videos')

const Video = require('../models/Video')

const router = express.Router()

const advancedResults = require('@comhub/middleware/advancedResults')
const { protect } = require('@comhub/middleware/auth')


router.route('/private').get(
  protect,
  advancedResults(
    Video,
    [
      { path: 'userId' },
      { path: 'categoryId' },
      { path: 'likes' },
      { path: 'dislikes' },
      { path: 'comments' }
    ],
    {
      status: 'private'
    }
  ),
  getVideos
)

router
  .route('/public')
  .get(
    advancedResults(
      Video,
      [
        { path: 'userId' },
        { path: 'categoryId' },
        { path: 'likes' },
        { path: 'dislikes' }
      ],
      { status: 'public' }
    ),
    getVideos
  )

// Get all public videos by user ID route
router.route('/public/:userId').get(getPublicVideosByUserId);

// Get all private videos by user ID route
router.route('/private/:userId').get(getPrivateVideosByUserId);

router
  .route('/:id')
  .get(getVideo)
  .put(protect, updateVideo)



router.route('/:id/views').put(protect, updateViews)

module.exports = router
