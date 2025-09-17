import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
export default function Nav() {
    const { user, logout } = useAuth();
    const location = useLocation();
    if (!user)
        return null;
    return (_jsx("nav", { className: "glass-nav sticky top-0 z-50 hidden md:block", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsx("div", { className: "flex items-center", children: _jsx(Link, { to: "/", className: "text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-cyan-300 transition-all", children: "MoOn Pro" }) }), _jsxs("div", { className: "hidden md:flex items-center space-x-1", children: [_jsx(NavLink, { to: "/", currentPath: location.pathname, children: "Inicio" }), user?.role === 'INQUILINO' && (_jsxs(_Fragment, { children: [_jsx(NavLink, { to: "/tenant/browse", currentPath: location.pathname, children: "Buscar compa\u00F1ero" }), _jsx(NavLink, { to: "/tenant/properties", currentPath: location.pathname, children: "Propiedades" })] })), user?.role === 'PROPIETARIO' && (_jsxs(_Fragment, { children: [_jsx(NavLink, { to: "/owner/dashboard", currentPath: location.pathname, children: "Dashboard" }), _jsx(NavLink, { to: "/owner/properties", currentPath: location.pathname, children: "Mis Propiedades" })] })), user?.role === 'ADMIN' && (_jsx(NavLink, { to: "/admin", currentPath: location.pathname, children: "Admin" })), _jsx(NavLink, { to: "/account", currentPath: location.pathname, children: "Mi Cuenta" })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "hidden lg:flex items-center space-x-3", children: [user?.image && (_jsx("img", { src: user.image, alt: user.name || 'Usuario', className: "w-8 h-8 rounded-full object-cover border-2 border-white/20" })), _jsxs("div", { className: "text-sm", children: [_jsx("div", { className: "text-white font-medium", children: user?.name || user?.email }), _jsx("div", { className: "text-gray-400 text-xs", children: user?.role })] })] }), _jsx("button", { onClick: logout, className: "glass-button-ghost px-4 py-2 text-sm font-medium rounded-lg transition-all hover:bg-white/10", children: "Salir" })] })] }) }) }));
}
// Componente auxiliar para los enlaces de navegación
function NavLink({ to, currentPath, children }) {
    const isActive = currentPath === to || (to !== '/' && currentPath.startsWith(to));
    return (_jsx(Link, { to: to, className: `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
            ? 'bg-white/10 text-white shadow-lg'
            : 'text-gray-300 hover:text-white hover:bg-white/5'}`, children: children }));
}
