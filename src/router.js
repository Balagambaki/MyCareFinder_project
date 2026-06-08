import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from "react-router-dom";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import HospitalDetails from "./pages/HospitalDetail";
import AdminHospitalEditor from "./pages/AdminHospitalEditor";
export const router = createBrowserRouter([
    { path: "/", element: _jsx(Search, {}) },
    { path: "/login", element: _jsx(Login, {}) },
    { path: "/register", element: _jsx(Register, {}) },
    { path: "/admin", element: _jsx(Admin, {}) },
    { path: "/hospital/:id", element: _jsx(HospitalDetails, {}) },
    { path: "/admin/editor", element: _jsx(AdminHospitalEditor, {}) }
]);
