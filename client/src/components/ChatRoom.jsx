import { useEffect, useState } from "react";
import api from "../services/api";
import { getSocket } from "../services/socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useAuth } from "../context/AuthContext";

const ChatRoom = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!room) return;
    setTypingUser(null);
    const socket = getSocket();

    const loadHistory = async () => {
      const { data } = await api.get(`/rooms/${room._id}/messages`);
      setMessages(data);
    };
    loadHistory();

    socket.emit("join_room", room._id);

    socket.on("receive_message", (msg) => {
      if (msg.roomId === room._id) setMessages((prev) => [...prev, msg]);
    });
    socket.on("typing", ({ username }) => setTypingUser(username));
    socket.on("stop_typing", () => setTypingUser(null));

    return () => {
      socket.emit("leave_room", room._id);
      socket.off("receive_message");
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [room]);

  if (!room) {
    return <div className="flex-1 flex items-center justify-center text-gray-400">Select a room</div>;
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b p-3 font-medium"># {room.name}</div>
      <MessageList messages={messages} currentUsername={user?.username} />
      {typingUser && <p className="text-xs text-gray-400 px-4">{typingUser} is typing…</p>}
      <MessageInput roomId={room._id} />
    </div>
  );
};

export default ChatRoom;
