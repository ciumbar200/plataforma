import React from "react";
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

function Protected({ children, roles }: { children: JSX.Element, roles?: string[] }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 24 }}>Cargando…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <div style={{ padding: 24 }}>No autorizado</div>;
  const needProfile = !user.image || !(user as any).videoUrl;
  if (needProfile && location.pathname !== "/account") return <Navigate to="/account" replace />;
  return (<>
    <Nav />
    <div className="min-h-screen">
      {children}
    </div>
    <MobileBottomNav />
  </>);
}

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/", element: <Protected><Home /></Protected> },
  { path: "/account", element: <Protected><Account /></Protected> },
  { path: "/tenant/browse", element: <Protected roles={["INQUILINO"]}><TenantBrowse /></Protected> },
  { path: "/tenant/properties", element: <Protected roles={["INQUILINO"]}><TenantProperties /></Protected> },
  { path: "/owner/dashboard", element: <Protected roles={["PROPIETARIO"]}><OwnerDashboard /></Protected> },
  { path: "/owner/properties", element: <Protected roles={["PROPIETARIO"]}><OwnerProperties /></Protected> },
  { path: "/owner/properties/:id/candidates", element: <Protected roles={["PROPIETARIO"]}><OwnerCandidates /></Protected> },
  { path: "/admin", element: <Protected roles={["ADMIN"]}><Admin /></Protected> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
