const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BillSchema = new Schema({
  description: {
    type: String
  },
  billDate: {
    type: Date,
    required: true
  },
  items: [
    {
      description: { type: String, required: true },
      amount: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  sharedBy: [
    {
      friend: {
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
      },
      percentage: { type: Number },
      actualAmount: { type: Number }
    }
  ],
  paidBy: [
    {
      friend: {
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
      },
      percentage: { type: Number },
      actualAmount: { type: Number }
    }
  ],
  event: {
    type: Schema.Types.ObjectId,
    ref: "events"
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

module.exports = Bill = mongoose.model("bills", BillSchema);
