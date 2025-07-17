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

// This line is THE most important part for deployment
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

const useSocket = (roomId) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // *** ADD THIS LINE FOR DEBUGGING ***
    console.log("Attempting to connect Socket.io to:", API_URL);

    const newSocket = io(API_URL);

    newSocket.emit("joinGame", { roomId });
    setSocket(newSocket);

    newSocket.on('connect', () => console.log('Socket connected to:', API_URL));
    newSocket.on('disconnect', () => console.log('Socket disconnected from:', API_URL));
    newSocket.on('connect_error', (err) => console.error('Socket connection error to', API_URL, err));

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [roomId]);

  return socket;
};

export default useSocket;