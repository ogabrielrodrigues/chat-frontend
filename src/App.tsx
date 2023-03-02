import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Sign } from "./pages/Sign";
import { socket, SocketContext } from "./contexts/SocketContext";
import { UserContextProvider } from "./contexts/UserContext";
import { Chat } from "./pages/Chat";
import { Rooms } from "./pages/Rooms";

function App() {
  const routes = createBrowserRouter([
    { path: "/", index: true, element: <Sign /> },
    { path: "/rooms", element: <Rooms /> },
    { path: "/chat/:room", element: <Chat /> },
  ]);

  return (
    <SocketContext.Provider value={socket}>
      <UserContextProvider>
        <RouterProvider router={routes}></RouterProvider>
      </UserContextProvider>
    </SocketContext.Provider>
  );
}

export default App;
