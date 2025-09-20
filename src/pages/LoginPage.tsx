import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { User, UserRole, RentalGoal, PropertyType } from '../types';
import { GoogleIcon, FacebookIcon, MoonIcon } from '../components/icons';
import GlassCard from '../components/GlassCard';

type RegistrationData = { rentalGoal: RentalGoal; city: string; locality: string };
type PublicationData = { property_type: PropertyType; city: string; locality: string };

interface LoginPageProps {
  onLogin: (user: User) => void;
  onRegister: (userData: Partial<User>) => void;
  onHomeClick: () => void;
  onOwnersClick: () => void;
  users: User[];
  registrationData?: RegistrationData | null;
  publicationData?: PublicationData | null;
  onBlogClick: () => void;
  onAboutClick: () => void;
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  onContactClick: () => void;
}

const LoginPage: React.FC<LoginPageProps> = (props) => {
  const { onLogin, onRegister, onHomeClick, onOwnersClick, users, registrationData, publicationData, ...footerProps } = props;
  
  const isRegisterMode = !!registrationData || !!publicationData;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegisterMode) {
        if (!name || !age || !email || !password) {
            setError("Por favor, completa todos los campos.");
            return;
        }
        onRegister({ email, name, age: parseInt(age, 10) });
    } else {
        if (email === 'admin@moon.com') { // Hardcoded admin login
            const adminUser = users.find(u => u.email === 'admin@moon.com');
            if (adminUser) {
                onLogin(adminUser);
                return;
            }
        }
        const user = users.find(u => u.email === email);
        if (user) {
          if (user.is_banned) {
            setError('Esta cuenta ha sido baneada.');
          } else {
            onLogin(user);
          }
        } else {
          setError('Usuario no encontrado. Para registrarte, inicia el proceso desde la página principal.');
        }
    }
  };

  const getRegistrationSubtitle = () => {
    if(publicationData) {
        return `Estás a un paso de publicar tu ${publicationData.property_type.toLowerCase()} en ${publicationData.locality}.`;
    }
    if(registrationData) {
        return `Crea tu cuenta para empezar a buscar en ${registrationData.locality}.`
    }
    return 'Únete a MoOn para encontrar tu match perfecto.';
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white flex flex-col">
      <Header onLoginClick={() => {}} onHomeClick={onHomeClick} onOwnersClick={onOwnersClick} pageContext={publicationData ? 'propietario' : 'inquilino'} />
      <main className="flex-grow flex items-center justify-center p-4">
        <GlassCard className="w-full max-w-md">
          <div className="text-center mb-8">
            <MoonIcon className="w-12 h-12 mx-auto text-indigo-400" />
            <h2 className="text-3xl font-bold mt-4">{isRegisterMode ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}</h2>
            <p className="text-white/70 mt-2">{isRegisterMode ? getRegistrationSubtitle() : 'Inicia sesión para continuar.'}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">Nombre Completo</label>
                  <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                 <div>
                  <label htmlFor="age" className="block text-sm font-medium text-white/80 mb-1">Edad</label>
                  <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="tu@email.com" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">Contraseña</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" required />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            {!isRegisterMode && (
                <div className="flex items-center justify-between">
                <a href="#" className="text-sm text-indigo-400 hover:underline">¿Olvidaste tu contraseña?</a>
                </div>
            )}

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
              {isRegisterMode ? 'Completar Registro' : 'Iniciar Sesión'}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-white/20"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-900 text-white/70">O continúa con</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="flex items-center justify-center gap-3 w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-lg">
                <GoogleIcon className="w-5 h-5" /><span>Google</span>
              </button>
               <button type="button" className="flex items-center justify-center gap-3 w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-lg">
                <FacebookIcon className="w-5 h-5" /><span>Facebook</span>
              </button>
            </div>
          </form>
           <p className="text-xs text-white/50 text-center mt-4">
            Hint: Usa 'admin@moon.com' o cualquier email de la base de datos para iniciar sesión.
          </p>
        </GlassCard>
      </main>
      <Footer {...footerProps} />
    </div>
  );
};

export default LoginPage;