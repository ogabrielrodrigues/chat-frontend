import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { socket, SocketContext } from "./contexts/SocketContext";
import { Chat } from "./pages/Chat";

function App() {
  const routes = createBrowserRouter([
    { path: "/chat/:room/:user/:id", element: <Chat /> },
  ]);

  return (
    <SocketContext.Provider value={socket}>
      <RouterProvider router={routes}></RouterProvider>
    </SocketContext.Provider>
  );
}

export default App;
