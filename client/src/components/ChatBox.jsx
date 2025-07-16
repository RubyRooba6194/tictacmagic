


// import React, { useState, useEffect, useRef } from "react";

// const ChatBox = ({ messages, sendMessage, disabled = false }) => {
//   const [input, setInput] = useState("");
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = () => {
//     if (input.trim() !== "" && !disabled) {
//       sendMessage(input.trim());
//       setInput("");
//     }
//   };

//   const formatMessage = (msg) => {
//     // Convert sender to lowercase for consistent comparison
//     const senderLower = msg.sender ? msg.sender.toLowerCase() : "";
//     const isUser = senderLower === "user";
//     const isAI = senderLower === "ai";
//     const isSystem = senderLower === "system"; // Added system for reset messages

//     return {
//       text: msg.message, // Use msg.message as defined in schema/socketHandler
//       isUser,
//       isAI,
//       isSystem,
//       timestamp: msg.timestamp,
//     };
//   };

//   const formatTime = (timestamp) => {
//     if (!timestamp) return "";
//     return new Date(timestamp).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <div className="fixed right-4 top-40 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 flex items-center">
//         <img src="/assets/chat-bubble.svg" alt="" className="h-5 w-5 mr-2" />
//         <h2 className="text-lg font-semibold">Game Chat 💬</h2>
//       </div>

//       {/* Messages */}
//       <div className="h-64 overflow-y-auto p-3 bg-gray-50">
//         {messages.map((msg, i) => {
//           const formatted = formatMessage(msg);
//           return (
//             <div
//               key={i}
//               className={`mb-3 ${
//                 formatted.isUser ? "text-right" : "text-left"
//               }`}
//             >
//               <div
//                 className={`inline-block max-w-xs px-3 py-2 rounded-lg text-sm ${
//                   formatted.isUser
//                     ? "bg-blue-500 text-white rounded-br-none"
//                     : formatted.isSystem
//                     ? "bg-gray-200 text-gray-800 rounded-lg text-center" // Style for system messages
//                     : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
//                 }`}
//               >
//                 <div className="break-words">{formatted.text}</div>
//                 <div
//                   className={`text-xs mt-1 ${
//                     formatted.isUser ? "text-blue-100" : "text-gray-500"
//                   }`}
//                 >
//                   {formatted.isUser ? "You" : formatted.isAI ? "AI" : "System"}{" "}
//                   • {formatTime(formatted.timestamp)}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="p-3 border-t border-gray-200 bg-white">
//         <div className="flex gap-2">
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//             className="flex-1 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
//             placeholder={disabled ? "Processing..." : "Type a message..."}
//             disabled={disabled}
//           />
//           <button
//             onClick={handleSendMessage}
//             disabled={disabled || !input.trim()}
//             className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatBox;



// src/components/ChatBox.jsx
import React, { useState, useEffect, useRef } from "react";

const ChatBox = ({ messages, sendMessage, disabled }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef(null); // Ref to scroll to bottom

  const handleSendClick = () => {
    sendMessage(currentMessage);
    setCurrentMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && currentMessage.trim() !== "") {
      handleSendClick();
    }
  };

  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col bg-gray-50 rounded-lg shadow-lg h-[500px] max-h-[500px] overflow-hidden">
      <h3 className="text-xl font-bold p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg shadow-md">
        Game Chat 💬
      </h3>
      <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar">
        {messages.map((chatMessage, index) => ( // <--- Check this line: 'chatMessage'
          <div
            key={index}
            className={`flex ${
              chatMessage.sender === "user" ? "justify-end" : "justify-start" // <--- Check this line: 'chatMessage.sender'
            }`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
                chatMessage.sender === "user"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {/* Display sender and message content */}
              <span className="font-semibold text-sm mr-1">
                {chatMessage.sender === "user" ? "You" : chatMessage.sender.toUpperCase()}:
              </span>
              <span>{chatMessage.message}</span> {/* <--- Check this line: 'chatMessage.message' */}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 flex space-x-3 bg-white">
        <input
          type="text"
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none text-gray-800"
          placeholder="Type a message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
        />
        <button
          onClick={handleSendClick}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled || currentMessage.trim() === ""}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;