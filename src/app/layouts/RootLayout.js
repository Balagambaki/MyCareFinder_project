import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
export default function RootLayout() {
    return (_jsxs("div", { children: [_jsx("h1", { children: "Carefinder" }), _jsx(Outlet, {})] }));
}
