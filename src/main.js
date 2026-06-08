import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx("div", { style: {
            minHeight: "100vh",
            background: "linear-gradient(150deg, #043142, #B8E1E1)", // cool SaaS background
        }, children: _jsx(RouterProvider, { router: router }) }) }));
