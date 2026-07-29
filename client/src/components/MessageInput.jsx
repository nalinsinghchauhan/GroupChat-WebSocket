import { useState } from "react";
import { getSocket } from "../services/socket";

const MessageInput = ({ roomId }) => {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
    getSocket()?.emit("typing", roomId);
  };

  const sendMessage = () => {
    if (!text.trim()) return;
    getSocket()?.emit("send_message", { roomId, content: text.trim() });
    getSocket()?.emit("stop_typing", roomId);
    setText("");
  };

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
