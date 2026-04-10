import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { socket } from "../socket";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  
  const [unreadChatIds, setUnreadChatIds] = useState(new Set());
  
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      const userId = user._id || user.userId;
      if (userId) {
        socket.emit("registerUser", userId);
      }
    }
  }, [isAuthenticated, user]);
  
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleNotification = ({ chatId }) => {
      if (chatId === activeChatId) return;
      setUnreadCount((prev) => prev + 1);
      setUnreadChatIds((prev) => new Set(prev).add(chatId));
    };

    socket.on("newMessageNotification", handleNotification);

    return () => {
      socket.off("newMessageNotification", handleNotification);
    };
  }, [isAuthenticated, activeChatId]);

  const clearUnread = useCallback(() => {
    setUnreadCount(0);
    setUnreadChatIds(new Set());
  }, []);

  const markChatRead = useCallback((chatId) => {
    setUnreadChatIds((prev) => {
      const next = new Set(prev);
      next.delete(chatId);
      return next;
    });
  }, []);

  const isChatUnread = useCallback(
    (chatId) => unreadChatIds.has(chatId),
    [unreadChatIds]
  );

  const enterChat = useCallback((chatId) => {
    setActiveChatId(chatId);
    setUnreadChatIds((prev) => {
      const next = new Set(prev);
      next.delete(chatId);
      return next;
    });
  }, []);

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
