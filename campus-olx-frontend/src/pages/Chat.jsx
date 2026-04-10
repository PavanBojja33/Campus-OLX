import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../socket";
import { jwtDecode } from "jwt-decode";
import { messageAPI, chatAPI } from "../services/api";
import { useChatNotifications } from "../context/ChatContext";

function Chat() {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatInfo, setChatInfo] = useState(null);

  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);

  const currentUserId = token ? jwtDecode(token).id : null;
  const { enterChat, leaveChat } = useChatNotifications();

  // Scroll page to top on mount (fix scroll offset)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mark this chat as active to suppress notifications
  useEffect(() => {
    if (chatId) enterChat(chatId);
    return () => leaveChat();
  }, [chatId, enterChat, leaveChat]);

  // Fetch chat info
  useEffect(() => {
    const fetchChatInfo = async () => {
      try {
        const res = await chatAPI.getMyChats();
        const chat = res.data.find((c) => c._id === chatId);
        if (chat) setChatInfo(chat);
      } catch (err) {
        console.log("Failed to fetch chat info:", err);
      }
    };
    if (chatId) fetchChatInfo();
  }, [chatId]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await messageAPI.getMessages(chatId);
        setMessages(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log("Failed to fetch messages:", err);
      }
    };

    if (chatId) fetchMessages();
  }, [chatId]);

  // Socket connection
  useEffect(() => {
    if (!chatId) return;

    socket.emit("joinChat", chatId);

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => {
        // Remove any optimistic message and add the real one
        const filtered = prev.filter(
          (m) => !(m._isOptimistic && m.content === msg.content && m.sender?._id === (msg.sender?._id || msg.sender))
        );
        // Also check if this exact message already exists (by _id)
        const exists = filtered.some((m) => m._id === msg._id);
        return exists ? filtered : [...filtered, msg];
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [chatId]);

  // Send message
  const sendMessage = () => {
    if (!input.trim()) return;

    const optimisticMsg = {
      _id: `optimistic_${Date.now()}`,
      content: input,
      sender: { _id: currentUserId },
      createdAt: new Date(),
      _isOptimistic: true,
    };

    // Show immediately
    setMessages((prev) => [...prev, optimisticMsg]);

    // Emit to server
    socket.emit("sendMessage", {
      chatId,
      content: input,
      token,
    });

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Get the other user's name for the header
  const otherUser = chatInfo?.users?.find((u) => u._id !== currentUserId);
  const chatTitle = otherUser?.name
    ? `Chat with ${otherUser.name}`
    : chatInfo?.item?.title
    ? chatInfo.item.title
    : "Chat";

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-100 dark:bg-gray-900 p-4 pt-8">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col h-[80vh]">

        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
          <button
            onClick={() => navigate("/chats")}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {chatTitle}
            </h2>
            {chatInfo?.item?.title && otherUser?.name && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Re: {chatInfo.item.title}
              </p>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                No messages yet. Start the conversation!
              </p>
            </div>
          )}
          {Array.isArray(messages) && messages.map((msg, index) => {
            const isMine =
              msg.sender?._id === currentUserId ||
              msg.sender === currentUserId;

            return (
              <div
                key={msg._id || index}
                className={`flex ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs break-words shadow-sm ${
                    isMine
                      ? "bg-primary-600 text-white rounded-br-sm"
                      : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-sm"
                  } ${msg._isOptimistic ? "opacity-70" : ""}`}
                >
                  {!isMine && (
                    <p className="text-xs font-semibold mb-1 opacity-80">
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
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />

          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-full transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;