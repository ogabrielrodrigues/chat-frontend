import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SocketContextProvider } from "./contexts/SocketContext";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SocketContextProvider>
      <App />
    </SocketContextProvider>
  </React.StrictMode>
);
