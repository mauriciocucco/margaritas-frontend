import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.tsx";
import Home from "./pages/home/Home.tsx";
import Warehouse from "./pages/warehouse/Warehouse.tsx";
import Recipes from "./pages/recipes/Recipes.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "warehouse",
        element: <Warehouse />,
      },
      {
        path: "recipes",
        element: <Recipes />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
