import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Chat } from "./pages/Chat";

function App() {
  const routes = createBrowserRouter([{ path: "/chat", element: <Chat /> }]);

  return <RouterProvider router={routes}></RouterProvider>;
}

export default App;