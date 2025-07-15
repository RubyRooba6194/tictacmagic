import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const useSocket = (roomId) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    newSocket.emit("joinRoom", roomId);
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [roomId]);

  return socket;
};

export default useSocket;
