const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Story Schema
const StorySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'public'
  },
  AllowComments: {
    type: Boolean,
    default: true
  },
  displayName: {
    type: String
  },
  comments: [
    {
      commentBody: {
        type: String,
        required: true
      },
      commentDate: {
        type: Date,
        default: Date.now
      },
      commentUser: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Create collections and add Schema
mongoose.model('stories', StorySchema, 'stories');
