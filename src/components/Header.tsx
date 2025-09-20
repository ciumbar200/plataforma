import React from 'react';
import { MoonIcon } from './icons';

interface HeaderProps {
    onLoginClick: () => void;
    onRegisterClick?: () => void; // Optional for different variants
    onHomeClick: () => void;
    onOwnersClick?: () => void;
    pageContext: 'inquilino' | 'propietario';
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onRegisterClick, onHomeClick, onOwnersClick, pageContext }) => {
    const isTenantContext = pageContext === 'inquilino';
    const switchText = isTenantContext ? 'Propietarios' : 'Inquilinos';
    const switchAction = isTenantContext ? onOwnersClick : onHomeClick;

    return (
        <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10 text-white w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <button className="flex items-center gap-2 cursor-pointer" onClick={onHomeClick}>
                        <MoonIcon className="w-7 h-7" />
                        <span className="text-xl font-bold">MoOn</span>
                    </button>
                    <nav className="hidden md:flex gap-8">
                        <a href="#como-funciona" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Cómo funciona</a>
                        <a href="#" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Sobre nosotros</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        {switchAction && (
                             <button
                                onClick={switchAction}
                                className="text-sm font-medium text-white/80 hover:text-white transition-colors px-3 py-2 rounded-full hover:bg-white/10"
                            >
                               {switchText}
                            </button>
                        )}
                        
                        {onRegisterClick ? (
                            // Variant for LoginPage, where switching modes is important
                            <>
                                <button
                                    onClick={onLoginClick}
                                    className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                                >
                                    Iniciar Sesión
                                </button>
                                <button
                                    onClick={onRegisterClick}
                                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-5 py-2 text-sm font-semibold hover:bg-white/20 transition-colors"
                                >
                                    Crear Cuenta
                                </button>
                            </>
                        ) : (
                            // Default variant for public pages: a single, clear CTA
                            <button
                                onClick={onLoginClick}
                                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-5 py-2 text-sm font-semibold hover:bg-white/20 transition-colors"
                            >
                                Acceder / Registrarse
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;