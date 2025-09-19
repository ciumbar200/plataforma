
import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { User, UserRole } from '../../types';
import { GoogleIcon, FacebookIcon, MoonIcon } from '../../components/icons';
import GlassCard from '../../components/GlassCard';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onHomeClick: () => void;
  onOwnersClick: () => void;
  users: User[];
  onBlogClick: () => void;
  onAboutClick: () => void;
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  onContactClick: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onHomeClick, onOwnersClick, users, onBlogClick, onAboutClick, onPrivacyClick, onTermsClick, onContactClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@moon.com') { // Hardcoded admin login
        const adminUser = users.find(u => u.role === UserRole.ADMIN);
        if (adminUser) {
            onLogin(adminUser);
            return;
        }
    }
    const user = users.find(u => u.email === email);
    if (user) {
      onLogin(user);
    } else {
      setError('Usuario no encontrado. El registro no está implementado en esta demo.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white flex flex-col">
      <Header onLoginClick={() => {}} onHomeClick={onHomeClick} onOwnersClick={onOwnersClick} pageContext="inquilino" />
      <main className="flex-grow flex items-center justify-center p-4">
        <GlassCard className="w-full max-w-md">
          <div className="text-center mb-8">
            <MoonIcon className="w-12 h-12 mx-auto text-indigo-400" />
            <h2 className="text-3xl font-bold mt-4">Bienvenido de nuevo</h2>
            <p className="text-white/70 mt-2">Inicia sesión para encontrar tu match perfecto.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <div className="flex items-center justify-between">
              <a href="#" className="text-sm text-indigo-400 hover:underline">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
              Iniciar Sesión
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-white/70">O continúa con</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="flex items-center justify-center gap-3 w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                <GoogleIcon className="w-5 h-5" />
                <span>Google</span>
              </button>
               <button type="button" className="flex items-center justify-center gap-3 w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                <FacebookIcon className="w-5 h-5" />
                <span>Facebook</span>
              </button>
            </div>
          </form>
          <p className="text-sm text-white/70 text-center mt-6">
            ¿No tienes cuenta? <a href="#" onClick={(e) => { e.preventDefault(); onHomeClick(); }} className="font-semibold text-indigo-400 hover:underline">Regístrate</a>
          </p>
           <p className="text-xs text-white/50 text-center mt-4">
            Hint: Usa 'admin@moon.com' o cualquier email de los datos de prueba.
          </p>
        </GlassCard>
      </main>
      <Footer onBlogClick={onBlogClick} onAboutClick={onAboutClick} onPrivacyClick={onPrivacyClick} onTermsClick={onTermsClick} onContactClick={onContactClick} />
    </div>
  );
};

export default LoginPage;
