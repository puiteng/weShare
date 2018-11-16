const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FriendSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  avatar: {
    backgroundColor: {
      type: String,
      required: true
    },
    colorNumber: {
      type: Number,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  isCurrentUser: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Friend = mongoose.model("friends", FriendSchema);
