const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  skill: {
    type: String,
    required: true,
  },
  type: {
    type: String, // "learn" or "teach"
    required: true,
  },
});

const messageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema({
  with: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messages: [messageSchema],
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  canTeach: {
    type: String,
    default: "",
  },
  wantToLearn: {
    type: String,
    default: "",
  },
  requests: [requestSchema],
  acceptedRequests: [requestSchema],
  chat: [chatSchema], // ✅ New chat field added
});

module.exports = mongoose.model("User", userSchema);
