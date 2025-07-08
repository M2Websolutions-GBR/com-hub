const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CommentSchema = new Schema(
  {
    text: {
      type: String,
      minlength: [3, 'Must be three characters long'],
      required: [true, 'Text is required']
    },
    videoId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Video',
      required: true
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
)

CommentSchema.virtual('replies', {
  ref: 'Reply',
  localField: '_id',
  foreignField: 'commentId',
  justOne: false,

  options: { sort: { createdAt: -1 } }
})

// Define the user virtual field
CommentSchema.virtual('user', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true,
  options: { select: 'avatarUrl channelName' } // Select only the required fields
});

module.exports = mongoose.model('Comment', CommentSchema)
