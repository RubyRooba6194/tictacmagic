import React, { useState } from "react";

const ChatBox = ({ messages, sendMessage }) => {
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim() !== "") {
      sendMessage(input.trim());
      setInput(""); // Clear the input box
    }
  };

  return (
    <div className="fixed right-4 top-40 w-80 md:w-96 p-4 bg-white rounded shadow-lg border">
      <img src="/assets/chat-bubble.svg" alt="" className="h-6 w-6 mr-2" />
      <h2 className="text-lg font-semibold mb-2 text-purple-700">
        Room Chat 💬
      </h2>
      <div className="h-40 overflow-y-auto mb-3 border p-2 rounded bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className="text-sm text-gray-800 mb-1">
            {msg}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-purple-300"
        placeholder="Type a message..."
      />
    </div>
  );
};

export default ChatBox;
