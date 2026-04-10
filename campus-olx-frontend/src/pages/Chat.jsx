import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { socket } from "../socket";
import { jwtDecode } from "jwt-decode";
import { useRef } from "react";

function Chat() {
  const { chatId } = useParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);

  const currentUserId = token ? jwtDecode(token).id : null;

    useEffect(() => {
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/messages/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Chats API:", res.data);
      setMessages(Array.isArray(res.data) ? res.data : res.data.messages || []);
    } catch (err) {
      console.log(err);
    }
  };

  if (chatId) fetchMessages();
}, [chatId]);

  // 🟢 2️⃣ Socket connection
  useEffect(() => {
  if (!chatId) return;

  socket.emit("joinChat", chatId);

  socket.on("receiveMessage", (msg) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m._id === msg._id);
      return exists ? prev : [...prev, msg];
    });
  });

  return () => {
    socket.off("receiveMessage");
  };
}, [chatId]);

  // 🟢 3️⃣ Send message
  const sendMessage = () => {
  if (!input.trim()) return;

  const newMsg = {
    _id: Date.now(),
    content: input,
    sender: { _id: currentUserId },
    createdAt: new Date(),
  };

  // ✅ 1. Show immediately
  setMessages((prev) => [...prev, newMsg]);

  // ✅ 2. Emit to server
  socket.emit("sendMessage", {
    chatId,
    content: input,
    token,
  });

  setInput("");
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col h-[80vh]">

        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Chat</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {Array.isArray(messages) && messages.map((msg, index) => {
            const isMine =
              msg.sender?._id === currentUserId ||
              msg.sender === currentUserId;

            return (
              <div
                key={msg._id || msg.createdAt || index}
                className={`flex ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs break-words shadow ${
                    isMine
                      ? "bg-green-500 text-white rounded-br-sm"
                      : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-sm"
                  }`}
                >
                  {!isMine && (
                    <p className="text-xs font-semibold mb-1">
                      {msg.sender?.name || "User"}
                    </p>
                  )}
                  <p>{msg.content}</p>

                  <p className="text-[10px] text-right opacity-70 mt-1">
                    {msg.createdAt ? formatTime(msg.createdAt) : ""}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-6 py-2 rounded-full"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;