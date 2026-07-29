import { useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "../services/socket";
import RoomList from "../components/RoomList";
import ChatRoom from "../components/ChatRoom";

const Chat = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, []);

  return (
    <div className="flex h-screen">
      <RoomList onSelectRoom={setSelectedRoom} />
      <ChatRoom room={selectedRoom} />
    </div>
  );
};

export default Chat;
