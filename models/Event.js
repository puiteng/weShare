const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  friends: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "friends",
        required: true
      },
      name: { type: String, required: true },
      email: { type: String, required: true },
      isCurrentUser: { type: Boolean, default: false },
      userId: { type: Schema.Types.ObjectId, ref: "users" },
      avatar: {
        backgroundColor: { type: String, required: true },
        colorNumber: { type: Number, required: true },
        text: { type: String, required: true }
      }
    }
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Event = mongoose.model("events", EventSchema);
