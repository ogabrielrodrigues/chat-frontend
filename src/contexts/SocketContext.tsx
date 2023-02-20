import { createContext, ReactNode, useEffect } from "react";
import { Socket } from "socket.io-client";
import { io } from "../lib/socketio";

interface SocketContextType {
  socket: Socket;
}

interface SocketContextProps {
  children: ReactNode;
}

const SocketContext = createContext({} as SocketContextType);

function SocketContextProvider({ children }: SocketContextProps) {
  return (
    <SocketContext.Provider value={{ socket: io }}>
      {children}
    </SocketContext.Provider>
  );
}

export { SocketContext, SocketContextProvider };
