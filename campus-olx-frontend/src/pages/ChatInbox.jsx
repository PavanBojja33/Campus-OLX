import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { chatAPI } from "../services/api";
import { jwtDecode } from "jwt-decode";
import { useChatNotifications } from "../context/ChatContext";
import Loader from "../components/Loader";

function ChatInbox() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUserId = token ? jwtDecode(token).id : null;
  const { clearUnread, isChatUnread, markChatRead } = useChatNotifications();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    clearUnread();
  }, [clearUnread]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await chatAPI.getMyChats();

        if (Array.isArray(res.data)) {
          setChats(res.data);
        } else {
          setChats([]);
        }
      } catch (err) {
        console.error("Fetch chats error:", err);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();

    if (isToday) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const handleOpenChat = (chatId) => {
    markChatRead(chatId);
    navigate(`/chat/${chatId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Your Conversations
        </h2>

        {chats.length === 0 && (
          <div className="text-center py-20">
            <svg
              className="mx-auto h-20 w-20 text-gray-400 dark:text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No conversations yet
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Start chatting by clicking &quot;Chat with Seller&quot; on any item listing.
            </p>
          </div>
        )}

        <div className="space-y-2">
          {chats.map((chat) => {
            const otherUser = chat.users?.find(
              (u) => u._id !== currentUserId
            );
            const displayName = otherUser?.name || "Unknown User";
            const initial = displayName.charAt(0).toUpperCase();
            const itemTitle = chat.item?.title || "";
            const lastMsg = chat.latestMessage?.content || "No messages yet";
            const lastMsgTime = chat.latestMessage?.createdAt || chat.updatedAt;
            const hasUnread = isChatUnread(chat._id);

            return (
              <div
                key={chat._id}
                onClick={() => handleOpenChat(chat._id)}
                className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all border ${
                  hasUnread
                    ? "bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 shadow-md ring-1 ring-primary-200 dark:ring-primary-800"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-md"
                }`}
              >
                <div className="relative shrink-0">
                  {otherUser?.avatarUrl ? (
                    <img
                      src={otherUser.avatarUrl}
                      alt={displayName}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-lg">
                      {initial}
                    </div>
                  )}
                  {hasUnread && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"></span>
                      <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-primary-500 border-2 border-white dark:border-gray-800"></span>
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className={`truncate ${
                      hasUnread
                        ? "font-bold text-gray-900 dark:text-white"
                        : "font-semibold text-gray-900 dark:text-white"
                    }`}>
                      {displayName}
                    </p>
                    {otherUser?.department && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
                        • {otherUser.department}
                      </span>
                    )}
                  </div>

                  {itemTitle && (
                    <p className="text-xs text-primary-600 dark:text-primary-400 truncate">
                      {itemTitle}
                    </p>
                  )}

                  <p className={`text-sm truncate mt-0.5 ${
                    hasUnread
                      ? "text-gray-800 dark:text-gray-200 font-medium"
                      : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {lastMsg}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-xs ${
                    hasUnread
                      ? "text-primary-600 dark:text-primary-400 font-semibold"
                      : "text-gray-400 dark:text-gray-500"
                  }`}>
                    {formatTime(lastMsgTime)}
                  </span>
                  {hasUnread && (
                    <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-primary-600 text-white text-[10px] font-bold px-1.5">
                      New
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ChatInbox;