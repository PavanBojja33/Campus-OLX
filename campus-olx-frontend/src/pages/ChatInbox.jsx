import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChatInbox() {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/chats`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setConversations(res.data);
    };

    fetchChats();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">Your Chats</h2>

      {conversations.map((chat) => (
        <div
          key={chat._id}
          onClick={() => navigate(`/chat/${chat._id}`)}
          className="p-4 border rounded-lg mb-3 cursor-pointer hover:bg-gray-100"
        >
          <p className="font-semibold">Item ID: {chat._id}</p>
          <p className="text-gray-600 text-sm">
            Last message: {chat.lastMessage}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ChatInbox;