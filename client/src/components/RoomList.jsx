import { useEffect, useState } from "react";
import api from "../services/api";

const RoomList = ({ onSelectRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDescription, setNewRoomDescription] = useState("");

  const fetchRooms = async () => {
    const { data } = await api.get("/rooms");
    setRooms(data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const createRoom = async () => {
    if (!newRoomName.trim()) return;
    await api.post("/rooms", {
      name: newRoomName.trim(),
      description: newRoomDescription.trim(),
    });
    setNewRoomName("");
    setNewRoomDescription("");
    setShowCreateMenu(false);
    fetchRooms();
  };

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div className="w-64 border-r p-3 relative">
      <div className="flex gap-2 mb-3 items-center">
        <input
          className="border p-1 rounded flex-1 text-sm"
          placeholder="Search rooms"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => setShowCreateMenu((prev) => !prev)}
          className="bg-black text-white px-2 rounded text-sm h-8 w-8 flex items-center justify-center"
          aria-label="Create room"
        >
          +
        </button>
      </div>
      {showCreateMenu && (
        <div className="absolute right-3 top-14 z-10 w-[calc(100%-1.5rem)] rounded border bg-white p-3 shadow-lg">
          <div className="space-y-2">
            <input
              className="border p-2 rounded w-full text-sm"
              placeholder="Chatroom name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
            <textarea
              className="border p-2 rounded w-full text-sm resize-none"
              placeholder="Description"
              rows="3"
              value={newRoomDescription}
              onChange={(e) => setNewRoomDescription(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowCreateMenu(false)}
                className="px-3 py-2 rounded border text-sm"
              >
                Cancel
              </button>
              <button onClick={createRoom} className="bg-black text-white px-3 py-2 rounded text-sm">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      <ul className="space-y-1">
        {filteredRooms.map((room) => (
          <li
            key={room._id}
            className="cursor-pointer p-2 rounded hover:bg-gray-100"
            onClick={() => onSelectRoom(room)}
          >
            <div className="font-medium"># {room.name}</div>
            {room.description && <div className="text-xs text-gray-500">{room.description}</div>}
          </li>
        ))}
        {!filteredRooms.length && (
          <li className="p-2 text-sm text-gray-400">No rooms found</li>
        )}
      </ul>
    </div>
  );
};

export default RoomList;
