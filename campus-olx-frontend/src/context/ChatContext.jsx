import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { socket } from "../socket";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
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
    };

    socket.on("newMessageNotification", handleNotification);

    return () => {
      socket.off("newMessageNotification", handleNotification);
    };
  }, [isAuthenticated, activeChatId]);

  // Clear all unread (when visiting inbox)
  const clearUnread = useCallback(() => {
    setUnreadCount(0);
  }, []);

  // Mark a specific chat as active (when entering a chat page)
  const enterChat = useCallback((chatId) => {
    setActiveChatId(chatId);
  }, []);

  // Leave chat (when leaving a chat page)
  const leaveChat = useCallback(() => {
    setActiveChatId(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        unreadCount,
        clearUnread,
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
