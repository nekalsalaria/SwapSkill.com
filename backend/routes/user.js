const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Message = require("../models/message");
const verifyToken = require("../middleware/verifyToken");

// 🔹 Get all users (excluding passwords)
router.get("/all", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// 🔹 Send a request (Request to Learn / Offer to Teach)
router.post("/request", verifyToken, async (req, res) => {
  const fromUserId = req.user.userId;
  const { toUserId, skill, type } = req.body;

  if (!toUserId || !skill || !type || !["learn", "teach"].includes(type)) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    const toUser = await User.findById(toUserId);
    if (!toUser) return res.status(404).json({ error: "User not found" });

    const alreadyPending = toUser.requests.some(
      (req) =>
        req.from.toString() === fromUserId &&
        req.skill.toLowerCase() === skill.toLowerCase() &&
        req.type === type
    );

    if (alreadyPending) {
      return res
        .status(400)
        .json({ error: "❌ You’ve already sent this request." });
    }

    const alreadyAccepted = toUser.acceptedRequests.some(
      (req) =>
        req.from.toString() === fromUserId &&
        req.skill.toLowerCase() === skill.toLowerCase() &&
        req.type === type
    );

    if (alreadyAccepted) {
      return res
        .status(400)
        .json({ error: "✅ This request was already accepted earlier." });
    }

    toUser.requests.push({ from: fromUserId, skill, type });
    await toUser.save();

    res.status(200).json({ message: "🎉 Request sent successfully!" });
  } catch (err) {
    console.error("Send request error:", err.message);
    res.status(500).json({ error: "Server error. Try again later." });
  }
});

// 🔹 Get incoming and accepted requests
router.get("/myrequests", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate("requests.from", "name email")
      .populate("acceptedRequests.from", "name email");

    res.status(200).json({
      requests: user.requests || [],
      acceptedRequests: user.acceptedRequests || [],
    });
  } catch (err) {
    console.error("Fetch request error:", err.message);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// 🔹 Accept a request
router.post("/accept", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); // B (accepting user)
    const { requestId } = req.body;

    const requestToAccept = user.requests.id(requestId);
    if (!requestToAccept) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Remove from pending & add to accepted
    user.requests.pull(requestId);
    user.acceptedRequests.push(requestToAccept);
    await user.save();

    // Also push into sender's acceptedRequests list
    const senderUser = await User.findById(requestToAccept.from); // A (who sent the request)
    senderUser.acceptedRequests.push({
      from: user._id,
      skill: requestToAccept.skill,
      type: requestToAccept.type === "learn" ? "teach" : "learn", // reverse type
    });
    await senderUser.save();

    res.status(200).json({ message: "Request accepted successfully" });
  } catch (err) {
    console.error("Accept error:", err.message);
    res.status(500).json({ error: "Failed to accept request" });
  }
});


// 🔹 Decline a request
router.post("/decline", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const { requestId } = req.body;

    const requestToDecline = user.requests.id(requestId);
    if (!requestToDecline) {
      return res.status(404).json({ error: "Request not found" });
    }

    user.requests.pull(requestId);
    await user.save();

    res.status(200).json({ message: "Request declined successfully" });
  } catch (err) {
    console.error("Decline error:", err.message);
    res.status(500).json({ error: "Failed to decline request" });
  }
});

// 🔹 Delete accepted request
router.post("/delete-accepted", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const { requestId } = req.body;

    const requestToDelete = user.acceptedRequests.id(requestId);
    if (!requestToDelete) {
      return res.status(404).json({ error: "Accepted request not found" });
    }

    user.acceptedRequests.pull(requestId);
    await user.save();

    res.status(200).json({ message: "Accepted request deleted successfully" });
  } catch (err) {
    console.error("Delete accepted request error:", err.message);
    res.status(500).json({ error: "Failed to delete request" });
  }
});

// 🔹 Send a message (stored in Message model)
router.post("/send-message", verifyToken, async (req, res) => {
  try {
    const { toUserId, text } = req.body;
    const fromUserId = req.user.userId;

    if (!toUserId || !text) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const message = new Message({
      sender: fromUserId,
      receiver: toUserId,
      content: text,
    });

    await message.save();

    res.status(200).json({ message: "Message sent ✅" });
  } catch (err) {
    console.error("Send message error:", err.message);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// 🔹 Get messages between two users
router.get("/get-messages/:userId", verifyToken, async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (err) {
    console.error("Get messages error:", err.message);
    res.status(500).json({ error: "Failed to get messages" });
  }
});

module.exports = router;
