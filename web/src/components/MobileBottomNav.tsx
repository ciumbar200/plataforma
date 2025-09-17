import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  roles?: string[];
}

const navItems: NavItem[] = [
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

  if (!user) return null;

  const filteredItems = navItems.filter(item => 
    !item.roles || item.roles.includes(user.role)
  );

  return (
    <>
      {/* Spacer for fixed bottom nav */}
      <div className="h-20 md:hidden" />
      
      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav md:hidden">
        <div className="flex justify-around items-center max-w-md mx-auto px-4">
          {filteredItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-item ${
                  isActive ? 'active' : ''
                } flex flex-col items-center justify-center min-w-0 flex-1`}
              >
                <div className="text-xl mb-1">{item.icon}</div>
                <span className="text-xs font-medium truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
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