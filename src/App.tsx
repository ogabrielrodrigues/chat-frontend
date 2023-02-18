import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Chat } from "./pages/Chat";
import { Sign } from "./pages/Sign";

function App() {
  const routes = createBrowserRouter([
    { path: "/chat/:room", element: <Chat /> },
    { path: "/sign", element: <Sign /> },
  ]);

  return <RouterProvider router={routes}></RouterProvider>;
}

export default App;
