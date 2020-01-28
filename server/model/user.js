const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      text: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      text: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model('user', UserSchema);

module.exports = User;
