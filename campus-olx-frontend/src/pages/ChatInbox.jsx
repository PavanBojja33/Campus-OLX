import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChatInbox() {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/chats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Chats API:", res.data);

        // ✅ SAFE: always ensure array
        if (Array.isArray(res.data)) {
          setChats(res.data);
        } else {
          setChats([]);
        }

      } catch (err) {
        console.error("Fetch chats error:", err);
        setChats([]);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">Your Chats</h2>

      {/* ✅ Empty state */}
      {(!Array.isArray(chats) || chats.length === 0) && (
        <p className="text-gray-500">No conversations yet</p>
      )}

      {/* ✅ Safe render */}
      {Array.isArray(chats) &&
        chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => navigate(`/chat/${chat._id}`)}
            className="flex items-center gap-4 p-4 border rounded-lg mb-3 cursor-pointer hover:bg-gray-100"
          >
            {/* Placeholder avatar */}
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              C
            </div>

            <div className="flex-1">
              {/* Chat ID (temporary) */}
              <p className="font-semibold truncate">
                Chat: {chat._id}
              </p>

              {/* Last message */}
              <p className="text-sm text-gray-500 truncate">
                {chat.lastMessage || "No messages"}
              </p>
            </div>

            {/* Time */}
            <div className="text-xs text-gray-400">
              {chat.updatedAt
                ? new Date(chat.updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </div>
          </div>
        ))}
    </div>
  );
}

export default ChatInbox;