const asyncHandler = require('@comhub/middleware/async')
const ErrorResponse = require('@comhub/middleware/errorResponse')
const advancedResultsFunc = require('../utils/advancedResultsFunc')

const Video = require('../models/Video')
const Subscription = require('../models/Subscription')

// @desc    Get all subscribers
// @route   GET /api/data/subscriptions/subscribers
// @access  Private
exports.getSubscribers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc    Get all channels subscribed to
// @route   GET /api/data/subscriptions/channels
// @access  Private
exports.getChannels = asyncHandler(async (req, res, next) => {
  const subscriptions = await Subscription.find({ subscriberId: req.user.id }).populate({
    path: 'channelId',
    select: 'avatarUrl channelName',
  });

  res.status(200).json({ success: true, data: subscriptions });
});

// @desc    Check subscription
// @route   POST /api/data/subscriptions/check
// @access  Private
exports.checkSubscription = asyncHandler(async (req, res, next) => {
  const subscription = await Subscription.findOne({
    channelId: req.body.channelId,
    subscriberId: req.user.id
  });

  if (!subscription) {
    return res.status(200).json({ success: true, data: null });
  }

  return res.status(200).json({ success: true, data: subscription });
});

exports.createSubscriber = asyncHandler(async (req, res, next) => {
  const { channelId } = req.body;
  console.log('channelId:', channelId);
  console.log('subscriberId:', req.user.id);

  if (channelId.toString() === req.user.id.toString()) {
    return next(new ErrorResponse(`You can't subscribe to your own channel`));
  }

  let subscription = await Subscription.findOne({
    channelId: channelId,
    subscriberId: req.user.id,
  });

  if (subscription) {
    await subscription.remove();
    return res.status(200).json({ success: true, data: {} });
  } else {
    subscription = await Subscription.create({
      subscriberId: req.user.id,
      channelId: channelId,
    });
    console.log('Subscription created:', subscription);
  }

  res.status(200).json({ success: true, data: subscription });
});

exports.deleteSubscription = asyncHandler(async (req, res, next) => {
  try {
    const channelId = req.query.channelId; 
    const userId = req.user.id; 

    // Call the unsubscribe method of the model
    const subscription = await Subscription.unsubscribe(channelId, userId);
    
    if (!subscription || subscription.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Subscription not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});


// @desc    Get subscribed videos
// @route   GET /api/data/subscriptions/videos
// @access  Private
exports.getSubscribedVideos = asyncHandler(async (req, res, next) => {
  const channels = await Subscription.find({
    subscriberId: req.user.id
  })

  if(channels.length === 0)
    return res.status(200).json({ success: true, data: {} })


  const channelsId = channels.map((channel) => {
    return {
      userId: channel.channelId.toString()
    }
  })

  const populates = [{ path: 'userId', select: 'avatarUrl channelName' }]
  advancedResultsFunc(req, res, Video, populates, 'public', channelsId)
})
