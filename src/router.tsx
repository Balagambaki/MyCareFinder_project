import { createBrowserRouter } from "react-router-dom";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import HospitalDetails from "./pages/HospitalDetail";
import AdminHospitalEditor from "./pages/AdminHospitalEditor";

export const router = createBrowserRouter([
  { path: "/", element: <Search /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/admin", element: <Admin /> },
  { path: "/hospital/:id", element: <HospitalDetails /> },
  { path: "/admin/editor", element: <AdminHospitalEditor /> }
]);