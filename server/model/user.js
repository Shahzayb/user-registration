const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    profilePic: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

UserSchema.index(
  { name: 'text', username: 'text' },
  { weights: { name: 5, username: 3 } }
);

const User = mongoose.model('user', UserSchema);

module.exports = User;
