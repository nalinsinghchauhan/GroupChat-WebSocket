import { useEffect, useState } from "react";
import api from "../services/api";

const RoomList = ({ onSelectRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");

  const fetchRooms = async () => {
    const { data } = await api.get("/rooms");
    setRooms(data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const createRoom = async () => {
    if (!newRoomName.trim()) return;
    await api.post("/rooms", { name: newRoomName.trim() });
    setNewRoomName("");
    fetchRooms();
  };

  return (
    <div className="w-64 border-r p-3">
      <div className="flex gap-2 mb-3">
        <input
          className="border p-1 rounded flex-1 text-sm"
          placeholder="New room"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <button onClick={createRoom} className="bg-black text-white px-2 rounded text-sm">
          +
        </button>
      </div>
      <ul className="space-y-1">
        {rooms.map((room) => (
          <li
            key={room._id}
            className="cursor-pointer p-2 rounded hover:bg-gray-100"
            onClick={() => onSelectRoom(room)}
          >
            # {room.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
