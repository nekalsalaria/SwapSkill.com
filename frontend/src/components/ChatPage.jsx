import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector((state) => state.user.token);
  const currentUser = useSelector((state) => state.user.userData);

  const { toUserId, toUserName, toUserEmail } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // 🔹 Fetch chat messages between current user and toUserId
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/get-messages/${toUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    if (toUserId) fetchMessages();
  }, [toUserId, token]);

  // 🔹 Handle sending a message
  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      await axios.post(
        "http://localhost:5000/api/user/send-message",
        {
          toUserId,
          text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update message in UI immediately
      setMessages((prev) => [
        ...prev,
        {
          sender: currentUser._id,
          receiver: toUserId,
          content: text,
        },
      ]);
      setText("");
    } catch (err) {
      console.error("Send error", err);
      alert("Failed to send message");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-yellow-100 p-6">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-4 flex justify-between items-center">
        <button
          onClick={() => navigate("/edit-profile")}
          className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800"
        >
          ← Back to Profile
        </button>
        <div className="text-right">
          <h2 className="text-lg font-bold text-gray-800">{toUserName}</h2>
          <p className="text-sm text-gray-500">{toUserEmail}</p>
        </div>
      </div>

      {/* Chat Box */}
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-4 min-h-[300px] flex flex-col justify-between">
        <div className="overflow-y-auto max-h-[300px] mb-4">
          {messages.length === 0 ? (
            <p className="text-gray-400">No messages yet</p>
          ) : (
            <ul className="space-y-2">
              {messages.map((msg, index) => (
                <li
                  key={index}
                  className={`${
                    msg.sender === currentUser._id ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block px-3 py-2 rounded-lg ${
                      msg.sender === currentUser._id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.content}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Input Box */}
        <div className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
