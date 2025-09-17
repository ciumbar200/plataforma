import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Nav() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  return (
    <nav className="glass-nav sticky top-0 z-50 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-cyan-300 transition-all"
            >
              MoOn Pro
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" currentPath={location.pathname}>Inicio</NavLink>
            
            {user?.role === 'INQUILINO' && (
              <>
                <NavLink to="/tenant/browse" currentPath={location.pathname}>Buscar compañero</NavLink>
                <NavLink to="/tenant/properties" currentPath={location.pathname}>Propiedades</NavLink>
              </>
            )}
            
            {user?.role === 'PROPIETARIO' && (
              <>
                <NavLink to="/owner/dashboard" currentPath={location.pathname}>Dashboard</NavLink>
                <NavLink to="/owner/properties" currentPath={location.pathname}>Mis Propiedades</NavLink>
              </>
            )}
            
            {user?.role === 'ADMIN' && (
              <NavLink to="/admin" currentPath={location.pathname}>Admin</NavLink>
            )}
            
            <NavLink to="/account" currentPath={location.pathname}>Mi Cuenta</NavLink>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-3">
              {user?.image && (
                <img 
                  src={user.image} 
                  alt={user.name || 'Usuario'} 
                  className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                />
              )}
              <div className="text-sm">
                <div className="text-white font-medium">{user?.name || user?.email}</div>
                <div className="text-gray-400 text-xs">{user?.role}</div>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="glass-button-ghost px-4 py-2 text-sm font-medium rounded-lg transition-all hover:bg-white/10"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Componente auxiliar para los enlaces de navegación
function NavLink({ to, currentPath, children }: { to: string; currentPath: string; children: React.ReactNode }) {
  const isActive = currentPath === to || (to !== '/' && currentPath.startsWith(to));
  
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-white/10 text-white shadow-lg' 
          : 'text-gray-300 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  );
}
