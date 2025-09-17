import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
const navItems = [
    {
        path: '/',
        label: 'Inicio',
        icon: '🏠'
    },
    {
        path: '/tenant/browse',
        label: 'Buscar',
        icon: '🔍',
        roles: ['INQUILINO']
    },
    {
        path: '/tenant/properties',
        label: 'Propiedades',
        icon: '🏢',
        roles: ['INQUILINO']
    },
    {
        path: '/owner/dashboard',
        label: 'Dashboard',
        icon: '📊',
        roles: ['PROPIETARIO']
    },
    {
        path: '/owner/properties',
        label: 'Mis Props',
        icon: '🏘️',
        roles: ['PROPIETARIO']
    },
    {
        path: '/admin',
        label: 'Admin',
        icon: '⚙️',
        roles: ['ADMIN']
    },
    {
        path: '/account',
        label: 'Perfil',
        icon: '👤'
    }
];
export default function MobileBottomNav() {
    const { user } = useAuth();
    const location = useLocation();
    if (!user)
        return null;
    const filteredItems = navItems.filter(item => !item.roles || item.roles.includes(user.role));
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "h-20 md:hidden" }), _jsx("nav", { className: "mobile-bottom-nav md:hidden", children: _jsx("div", { className: "flex justify-around items-center max-w-md mx-auto px-4", children: filteredItems.slice(0, 5).map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/' && location.pathname.startsWith(item.path));
                        return (_jsxs(Link, { to: item.path, className: `mobile-nav-item ${isActive ? 'active' : ''} flex flex-col items-center justify-center min-w-0 flex-1`, children: [_jsx("div", { className: "text-xl mb-1", children: item.icon }), _jsx("span", { className: "text-xs font-medium truncate", children: item.label })] }, item.path));
                    }) }) })] }));
}
// Hook para detectar si estamos en móvil
export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(false);
    React.useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);
    return isMobile;
}
