const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema(
  {
    subscriberId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Subscriber id is required']
    },
    channelId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

// Static method to unsubscribe
SubscriptionSchema.statics.unsubscribe = async function(channelId, subscriberId) {
  try {
    const subscription = await this.deleteOne({ channelId, subscriberId });
    return subscription;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = mongoose.model('Subscription', SubscriptionSchema);
