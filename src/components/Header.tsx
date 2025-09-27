import React, { useState, useEffect, useRef } from 'react';
import { MoonIcon, ChevronDownIcon } from './icons';

interface HeaderProps {
    onLoginClick: () => void;
    onRegisterClick?: () => void;
    onHomeClick: () => void;
    onOwnersClick?: () => void;
    pageContext: 'inquilino' | 'propietario';
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onRegisterClick, onHomeClick, onOwnersClick, pageContext }) => {
    const isTenantContext = pageContext === 'inquilino';
    const switchText = isTenantContext ? 'Propietarios' : 'Inquilinos';
    const switchAction = isTenantContext ? onOwnersClick : onHomeClick;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    const handleRegister = () => {
        onRegisterClick?.();
        setIsDropdownOpen(false);
    }

    const handleLogin = () => {
        onLoginClick();
        setIsDropdownOpen(false);
    }
    
    const headerClasses = `
        top-0 z-50 text-white w-full transition-all duration-300 h-16
        ${isScrolled 
            ? 'sticky bg-black/20 backdrop-blur-lg border-b border-white/10' // Scrolled state: glassmorphism + sticky
            : 'absolute bg-transparent border-b border-transparent' // Top state: fully transparent and absolute
        }
    `;

    return (
        <header className={headerClasses.trim()}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="relative flex justify-between items-center h-full">
                    <div className="flex-1 flex justify-start">
                        <button className="flex items-center gap-2 cursor-pointer" onClick={onHomeClick}>
                            <MoonIcon className="w-7 h-7" />
                            <span className="text-xl font-bold">MoOn</span>
                        </button>
                    </div>

                    <nav className="hidden md:flex gap-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <a href="#como-funciona" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Cómo funciona</a>
                        <a href="#faq" className="text-sm font-medium text-white/80 hover:text-white transition-colors">FAQ</a>
                    </nav>
                    
                    <div className="flex-1 flex justify-end">
                        <div className="flex items-center gap-4">
                            {switchAction && (
                                 <button
                                    onClick={switchAction}
                                    className="hidden md:flex text-sm font-medium text-white/80 hover:text-white transition-colors px-3 py-2 rounded-full hover:bg-white/10"
                                >
                                   {switchText}
                                </button>
                            )}
                            
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(prev => !prev)}
                                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-5 py-2 text-sm font-semibold hover:bg-white/20 transition-colors flex items-center gap-2"
                                >
                                    Mi Cuenta
                                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800/90 backdrop-blur-2xl border border-white/20 rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in-down">
                                        <div className="p-2">
                                            <button
                                                onClick={handleLogin}
                                                className="w-full text-left px-4 py-2 text-sm rounded-md hover:bg-white/10 transition-colors"
                                            >
                                                Iniciar Sesión
                                            </button>
                                            {onRegisterClick && (
                                                <button
                                                    onClick={handleRegister}
                                                    className="w-full text-left px-4 py-2 text-sm rounded-md hover:bg-white/10 transition-colors"
                                                >
                                                    Registrarse
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;