import {useEffect,useState} from "react"
import {io} from "socket.io-client"

const socket=io("http://localhost:5000");

function Chat(){
    const roomId="test123";
    const token = localStorage.getItem("token");
    const [message,setMessage] = useState("");
    const [messages,setMessages] = useState([]);
    
    useEffect(() => {
        socket.emit("joinRoom",roomId);
        socket.on("receiveMessage" ,(msg) => {
            setMessages((prev) => [...prev,msg]);
        })
        return () =>{
            socket.off("receiveMessage");
        };

    },[]);

    const sendMessage = () =>{
        if(message.trim() === "") return;

        socket.emit("sendMessage",{roomId,message,token});
        setMessage("");
    }

    return (
        <div>
            <h2>Private Chat</h2>

            <div style={{ border: "1px solid gray", height: "200px", overflowY: "scroll" }}>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>

            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    )
}

export default Chat;