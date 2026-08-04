import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectSocket, disconnectSocket } from "../services/socket";
import RoomList from "../components/RoomList";
import ChatRoom from "../components/ChatRoom";
import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <p className="text-sm text-gray-500">Signed in as</p>
          <p className="font-medium">{user?.username}</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Logout
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <RoomList onSelectRoom={setSelectedRoom} />
        <ChatRoom room={selectedRoom} />
      </div>
    </div>
  );
};

export default Chat;
