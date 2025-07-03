const express = require('express');
const {
  getChannels,
  getSubscribers,
  createSubscriber,
  checkSubscription,
  getSubscribedVideos,
  deleteSubscription
} = require('../controllers/subscriptions');

const Subscription = require('../models/Subscription');

const router = express.Router();

const advancedResults = require('@comhub/middleware/advancedResults');
const { protect } = require('@comhub/middleware/auth');

// Create subscriber
router.post('/', protect, createSubscriber);

// Check subscription
router.post('/check', protect, checkSubscription);

// Get subscribers
router.route('/subscribers').get(
  protect,
  advancedResults(Subscription, [{ path: 'subscriberId' }], {
    status: 'private',
    filter: 'channel'
  }),
  getSubscribers
);

// Get channels
router.route('/channels').get(
  advancedResults(Subscription, [
    { path: 'channelId', select: 'avatarUrl channelName' }
  ]),
  protect, getChannels
);

// Get subscribed videos
router.route('/videos').get(protect, getSubscribedVideos);

// Delete subscription
router.delete('/subscriptions', protect, deleteSubscription);

module.exports = router;
