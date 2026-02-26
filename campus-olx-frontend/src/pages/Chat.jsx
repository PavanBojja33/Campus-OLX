import {useEffect,useState,useRef} from "react"
import {io} from "socket.io-client"
import { jwtDecode } from "jwt-decode"
import { useParams } from "react-router-dom";
import { socket } from "../socket";

function Chat(){
    const { itemId } = useParams();
    const roomId = itemId;
    const token = localStorage.getItem("token");
    const messagesEndRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);

    if (!token) {
        console.log("No token found");
        return;
    }
    const decoded = jwtDecode(token);
    const currentUserId = decoded.id;

    const [message,setMessage] = useState("");
    const [messages,setMessages] = useState([]);
    
    useEffect(() => {
        socket.emit("joinRoom",roomId);
        socket.on("receiveMessage" ,(msg) => {
            setMessages((prev) => [...prev,msg]);
            console.log("Received",msg)
        })
        return () =>{
            socket.off("receiveMessage");
        };

        // socket.on("showTyping", () => {
        //     setIsTyping(true);
        // });

        // socket.on("hideTyping", () => {
        //     setIsTyping(false);
        // });

    },[roomId]);

    const sendMessage = () =>{
        if(message.trim() === "") return;

        socket.emit("sendMessage",{roomId,message,token});
        setMessage("");
    }

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col h-[80vh]">

            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Private Chat
                </h2>
            </div>

            {/* Messages Area */}
            <div
                className="flex-1 overflow-y-auto p-4 space-y-3"
            >
                {messages.map((msg, index) => {
                const isMine =
                    msg.sender?._id === currentUserId ||
                    msg.sender === currentUserId;

                return (
                    <div
                    key={index}
                    className={`flex ${
                        isMine ? "justify-end" : "justify-start"
                    }`}
                    >
                    <div
                        className={`px-4 py-2 rounded-2xl max-w-xs break-words ${
                        isMine
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                        }`}
                    >
                        {msg.message}
                    </div>
                    </div>
                );
                })}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Type a message..."
                />

                <button
                onClick={sendMessage}
                className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition"
                >
                Send
                </button>
            </div>
            </div>
        </div>
        );
}

export default Chat;