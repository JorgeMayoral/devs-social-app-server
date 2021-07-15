const { Schema, model } = require('mongoose');

const postSchema = new Schema(
  {
    body: {
      type: String,
      required: 'Body is required',
    },
    authorId: {
      type: Schema.Types.ObjectId,
      required: 'Author is required',
      ref: 'User',
    },
    authorName: {
      type: String,
      required: 'Author name is required',
    },
    authorUsername: {
      type: String,
      required: 'Author username is required',
    },
    likes: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: 'User',
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
    isComment: {
      type: Boolean,
      default: false,
    },
    comments: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: 'Post',
    },
  },
  { timestamps: true },
);

const Post = model('Post', postSchema);

module.exports = { Post };
