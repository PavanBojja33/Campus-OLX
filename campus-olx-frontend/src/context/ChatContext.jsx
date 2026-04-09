import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { socket } from "../socket";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  // Track which chatIds have unread messages (for highlighting in inbox)
  const [unreadChatIds, setUnreadChatIds] = useState(new Set());
  // Track which chatId the user is currently viewing
  const [activeChatId, setActiveChatId] = useState(null);

  // Register user for personal notifications when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const userId = user._id || user.userId;
      if (userId) {
        socket.emit("registerUser", userId);
      }
    }
  }, [isAuthenticated, user]);

  // Listen for new message notifications
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleNotification = ({ chatId }) => {
      // Don't increment if user is currently viewing this chat
      if (chatId === activeChatId) return;
      setUnreadCount((prev) => prev + 1);
      setUnreadChatIds((prev) => new Set(prev).add(chatId));
    };

    socket.on("newMessageNotification", handleNotification);

    return () => {
      socket.off("newMessageNotification", handleNotification);
    };
  }, [isAuthenticated, activeChatId]);

  // Clear all unread (when visiting inbox)
  const clearUnread = useCallback(() => {
    setUnreadCount(0);
    setUnreadChatIds(new Set());
  }, []);

  // Mark a specific chat as read (when opening a conversation)
  const markChatRead = useCallback((chatId) => {
    setUnreadChatIds((prev) => {
      const next = new Set(prev);
      next.delete(chatId);
      return next;
    });
  }, []);

  // Check if a specific chat has unread messages
  const isChatUnread = useCallback(
    (chatId) => unreadChatIds.has(chatId),
    [unreadChatIds]
  );

  // Mark a specific chat as active (when entering a chat page)
  const enterChat = useCallback((chatId) => {
    setActiveChatId(chatId);
    // Also mark it read immediately
    setUnreadChatIds((prev) => {
      const next = new Set(prev);
      next.delete(chatId);
      return next;
    });
  }, []);

  // Leave chat (when leaving a chat page)
  const leaveChat = useCallback(() => {
    setActiveChatId(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        unreadCount,
        unreadChatIds,
        clearUnread,
        markChatRead,
        isChatUnread,
        enterChat,
        leaveChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatNotifications() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatNotifications must be used within ChatProvider");
  }
  return context;
}
