const express = require('express')
const {
  getReplies,
  createReply,
  updateReply,
  deleteReply
} = require('../controllers/replies')

const Reply = require('../models/Reply')

const router = express.Router()

const advancedResults = require('@comhub/middleware/advancedResults')
const { protect } = require('@comhub/middleware/auth')

router
  .route('/')
  .get(advancedResults(Reply), getReplies)
  .post(protect, createReply)

router.route('/:id').put(protect, updateReply).delete(protect, deleteReply)

module.exports = router
