import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(150deg, #043142, #B8E1E1)", // cool SaaS background
      }}
    >
      <RouterProvider router={router} />
    </div>
  </React.StrictMode>
);