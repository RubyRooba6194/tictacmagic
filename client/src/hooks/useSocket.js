// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const useSocket = (roomId) => {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const newSocket = io("http://localhost:5000");
//     newSocket.emit("joinGame", { roomId }); // Changed to joinGame and sent as object
//     setSocket(newSocket);
//     return () => newSocket.disconnect();
//   }, [roomId]);

//   return socket;
// };

// export default useSocket;


// src/hooks/useSocket.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Get the API URL from environment variables
// VITE_API_URL is the standard for Vite projects
// The fallback to 'http://localhost:5000' is for local development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const useSocket = (roomId) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Use the API_URL from the environment variable
    const newSocket = io(API_URL); // <--- CRUCIAL CHANGE HERE
    newSocket.emit("joinGame", { roomId });
    setSocket(newSocket);

    // Add logging for debugging connection
    newSocket.on('connect', () => console.log('Socket connected to:', API_URL));
    newSocket.on('disconnect', () => console.log('Socket disconnected from:', API_URL));
    newSocket.on('connect_error', (err) => console.error('Socket connection error to', API_URL, err));


    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [roomId]); // Re-run effect if roomId changes

  return socket;
};

export default useSocket;