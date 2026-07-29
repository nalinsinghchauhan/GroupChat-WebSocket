import { useEffect, useRef } from "react";

const MessageList = ({ messages, currentUsername }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((msg, i) => (
        <div
          key={msg._id || i}
          className={`max-w-xs p-2 rounded text-sm ${
            msg.senderUsername === currentUsername
              ? "bg-black text-white ml-auto"
              : "bg-gray-100"
          }`}
        >
          <p className="text-xs opacity-70 mb-1">{msg.senderUsername}</p>
          <p>{msg.content}</p>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
