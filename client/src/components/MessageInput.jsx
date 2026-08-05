import { useEffect, useRef, useState } from "react";
import { getSocket } from "../services/socket";

const MessageInput = ({ roomId, pendingLeaveRoomId, onClearPendingLeaveRoom }) => {
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef(null);
  const hasActivatedRoomRef = useRef(false);

  const clearTypingTimeout = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    if (!hasActivatedRoomRef.current) {
      if (pendingLeaveRoomId && pendingLeaveRoomId !== roomId) {
        getSocket()?.emit("leave_room", pendingLeaveRoomId);
      }
      getSocket()?.emit("announce_join", roomId);
      onClearPendingLeaveRoom?.();
      hasActivatedRoomRef.current = true;
    }
    const socket = getSocket();
    socket?.emit("typing", roomId);

    clearTypingTimeout();
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit("stop_typing", roomId);
      typingTimeoutRef.current = null;
    }, 1000);
  };

  const sendMessage = () => {
    if (!text.trim()) return;
    const socket = getSocket();
    if (!hasActivatedRoomRef.current) {
      if (pendingLeaveRoomId && pendingLeaveRoomId !== roomId) {
        socket?.emit("leave_room", pendingLeaveRoomId);
      }
      socket?.emit("announce_join", roomId);
      onClearPendingLeaveRoom?.();
      hasActivatedRoomRef.current = true;
    }
    socket?.emit("send_message", { roomId, content: text.trim() });
    socket?.emit("stop_typing", roomId);
    clearTypingTimeout();
    setText("");
  };

  useEffect(() => {
    hasActivatedRoomRef.current = false;
    return () => {
      clearTypingTimeout();
      getSocket()?.emit("stop_typing", roomId);
    };
  }, [roomId]);

  return (
    <div className="flex gap-2 p-3 border-t">
      <input
        className="border flex-1 p-2 rounded"
        placeholder="Type a message"
        value={text}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage} className="bg-black text-white px-4 rounded">
        Send
      </button>
    </div>
  );
};

export default MessageInput;
