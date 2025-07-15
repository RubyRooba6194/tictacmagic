// import React, { useState } from "react";

// const ChatBox = ({ messages, sendMessage }) => {
//   const [input, setInput] = useState("");

//   const handleSendMessage = () => {
//     if (input.trim() !== "") {
//       sendMessage(input.trim());
//       setInput(""); // Clear the input box
//     }
//   };

//   return (
//     <div className="fixed right-4 top-40 w-80 md:w-96 p-4 bg-white rounded shadow-lg border">
//       <img src="/assets/chat-bubble.svg" alt="" className="h-6 w-6 mr-2" />
//       <h2 className="text-lg font-semibold mb-2 text-purple-700">
//         Room Chat 💬
//       </h2>
//       <div className="h-40 overflow-y-auto mb-3 border p-2 rounded bg-gray-50">
//         {messages.map((msg, i) => (
//           <div key={i} className="text-sm text-gray-800 mb-1">
//             {msg}
//           </div>
//         ))}
//       </div>
//       <input
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//         className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-purple-300"
//         placeholder="Type a message..."
//       />
//     </div>
//   );
// };

// export default ChatBox;


import React, { useState, useEffect, useRef } from "react";

const ChatBox = ({ messages, sendMessage, disabled = false }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() !== "" && !disabled) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  const formatMessage = (msg) => {
    // Convert sender to lowercase for consistent comparison
    const senderLower = msg.sender ? msg.sender.toLowerCase() : "";
    const isUser = senderLower === "user";
    const isAI = senderLower === "ai";
    const isSystem = senderLower === "system"; // Added system for reset messages

    return {
      text: msg.message, // Use msg.message as defined in schema/socketHandler
      isUser,
      isAI,
      isSystem,
      timestamp: msg.timestamp,
    };
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed right-4 top-40 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 flex items-center">
        <img src="/assets/chat-bubble.svg" alt="" className="h-5 w-5 mr-2" />
        <h2 className="text-lg font-semibold">Game Chat 💬</h2>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-3 bg-gray-50">
        {messages.map((msg, i) => {
          const formatted = formatMessage(msg);
          return (
            <div
              key={i}
              className={`mb-3 ${
                formatted.isUser ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block max-w-xs px-3 py-2 rounded-lg text-sm ${
                  formatted.isUser
                    ? "bg-blue-500 text-white rounded-br-none"
                    : formatted.isSystem
                    ? "bg-gray-200 text-gray-800 rounded-lg text-center" // Style for system messages
                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                }`}
              >
                <div className="break-words">{formatted.text}</div>
                <div
                  className={`text-xs mt-1 ${
                    formatted.isUser ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {formatted.isUser ? "You" : formatted.isAI ? "AI" : "System"}{" "}
                  • {formatTime(formatted.timestamp)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
            placeholder={disabled ? "Processing..." : "Type a message..."}
            disabled={disabled}
          />
          <button
            onClick={handleSendMessage}
            disabled={disabled || !input.trim()}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;