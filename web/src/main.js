import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./styles/glassmorphism.css";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Account from "./pages/Account";
import TenantBrowse from "./pages/TenantBrowse";
import TenantProperties from "./pages/TenantProperties";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerProperties from "./pages/OwnerProperties";
import OwnerCandidates from "./pages/OwnerCandidates";
import Admin from "./pages/Admin";
import Nav from "./components/Nav";
import MobileBottomNav from "./components/MobileBottomNav";
function Protected({ children, roles }) {
    const { user, loading } = useAuth();
    if (loading)
        return _jsx("div", { style: { padding: 24 }, children: "Cargando\u2026" });
    if (!user)
        return _jsx(Navigate, { to: "/login", replace: true });
    if (roles && !roles.includes(user.role))
        return _jsx("div", { style: { padding: 24 }, children: "No autorizado" });
    const needProfile = !user.image || !user.videoUrl;
    if (needProfile && location.pathname !== "/account")
        return _jsx(Navigate, { to: "/account", replace: true });
    return (_jsxs(_Fragment, { children: [_jsx(Nav, {}), _jsx("div", { className: "min-h-screen", children: children }), _jsx(MobileBottomNav, {})] }));
}
const router = createBrowserRouter([
    { path: "/login", element: _jsx(Login, {}) },
    { path: "/", element: _jsx(Protected, { children: _jsx(Home, {}) }) },
    { path: "/account", element: _jsx(Protected, { children: _jsx(Account, {}) }) },
    { path: "/tenant/browse", element: _jsx(Protected, { roles: ["INQUILINO"], children: _jsx(TenantBrowse, {}) }) },
    { path: "/tenant/properties", element: _jsx(Protected, { roles: ["INQUILINO"], children: _jsx(TenantProperties, {}) }) },
    { path: "/owner/dashboard", element: _jsx(Protected, { roles: ["PROPIETARIO"], children: _jsx(OwnerDashboard, {}) }) },
    { path: "/owner/properties", element: _jsx(Protected, { roles: ["PROPIETARIO"], children: _jsx(OwnerProperties, {}) }) },
    { path: "/owner/properties/:id/candidates", element: _jsx(Protected, { roles: ["PROPIETARIO"], children: _jsx(OwnerCandidates, {}) }) },
    { path: "/admin", element: _jsx(Protected, { roles: ["ADMIN"], children: _jsx(Admin, {}) }) },
]);
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(AuthProvider, { children: _jsx(RouterProvider, { router: router }) }));
