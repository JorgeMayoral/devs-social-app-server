const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: 'Username is required',
    },
    name: {
      type: String,
      required: 'Name is required',
    },
    email: {
      type: String,
      required: 'Email is required',
    },
    password: {
      type: String,
      required: 'Password is required',
    },
    posts: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    likes: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    followers: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    following: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
  },
  { timestamps: true },
);

userSchema.methods.matchPassword = async function (plaintText) {
  return await bcrypt.compare(plaintText, this.password);
};

userSchema.methods.renameId = function () {
  let user = this.toObject();

  user.id = user._id;
  delete user._id;

  return user;
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

const User = model('User', userSchema);

module.exports = { User };
