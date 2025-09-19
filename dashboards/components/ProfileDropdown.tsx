
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../types';
import { LogoutIcon, PencilIcon, ChevronDownIcon } from '../../components/icons';

interface ProfileDropdownProps {
  user: User;
  onLogout: () => void;
  onAccountSettings: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, onLogout, onAccountSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2 rounded-full hover:bg-white/10 p-1 transition-colors"
      >
        {/* FIX: Corrected property name from profilePicture to profile_picture. */}
        <img src={user.profile_picture} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-white/20" />
        <span className="hidden sm:inline font-semibold text-sm">{user.name}</span>
        <ChevronDownIcon className={`w-4 h-4 text-white/70 transition-transform hidden sm:inline ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-slate-800/90 backdrop-blur-2xl border border-white/20 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-white/10">
            <p className="font-semibold text-sm truncate">{user.name}</p>
            <p className="text-xs text-white/60 capitalize">{user.role.toLowerCase()}</p>
          </div>
          <div className="p-2">
            <button
              onClick={() => {
                onAccountSettings();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left rounded-md hover:bg-white/10 transition-colors"
            >
              <PencilIcon className="w-5 h-5 text-white/70" />
              <span>Ajustes de Cuenta</span>
            </button>
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left text-red-400 rounded-md hover:bg-red-500/20 transition-colors"
            >
              <LogoutIcon className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
