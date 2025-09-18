
import React, { useState } from 'react';
import { GoogleIcon, FacebookIcon, MoonIcon, EyeIcon } from '../components/icons';
import GlassCard from '../components/GlassCard';

interface LoginPageProps {
  onLogin: (email: string) => void;
  onSwitchToRegister: () => void;
  onBackToHome: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToRegister, onBackToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
        alert("Por favor, introduce un email válido.");
        return;
    }
    onLogin(email);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white flex flex-col items-center justify-center p-4">
        <div className="absolute top-6 left-6">
             <button className="flex items-center gap-2 cursor-pointer" onClick={onBackToHome}>
                <MoonIcon className="w-7 h-7" />
                <span className="text-xl font-bold">MoOn</span>
            </button>
        </div>
        <GlassCard className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white">Bienvenido de Nuevo</h1>
                <p className="text-white/70 mt-2">Inicia sesión para encontrar tu match perfecto.</p>
            </div>
            
            <div className="flex flex-col gap-4 mb-6">
                <button className="w-full flex items-center justify-center gap-3 bg-[#4285F4] hover:bg-[#357ae8] text-white font-semibold py-3 rounded-lg transition-colors">
                    <GoogleIcon className="w-6 h-6" />
                    <span>Continuar con Google</span>
                </button>
                <button className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold py-3 rounded-lg transition-colors">
                    <FacebookIcon className="w-6 h-6" />
                    <span>Continuar con Facebook</span>
                </button>
            </div>
            
            <div className="flex items-center my-6">
                <hr className="w-full border-white/20" />
                <span className="px-4 text-white/70 text-sm">O</span>
                <hr className="w-full border-white/20" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
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
                    <div className="relative">
                        <input 
                            type="password" 
                            id="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                            placeholder="••••••••"
                            required
                        />
                         <EyeIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                    </div>
                </div>
                <div className="text-right">
                    <a href="#" className="text-sm text-indigo-400 hover:underline">¿Has olvidado tu contraseña?</a>
                </div>
                <div>
                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg"
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </form>
            
            <div className="text-center mt-8">
                <p className="text-white/70">
                    ¿No tienes una cuenta?{' '}
                    <button onClick={onSwitchToRegister} className="font-semibold text-indigo-400 hover:underline">Regístrate gratis</button>
                </p>
            </div>
        </GlassCard>
    </div>
  );
};

export default LoginPage;
