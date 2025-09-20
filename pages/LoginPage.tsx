import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { User, UserRole, RentalGoal, PropertyType } from '../src/types';
import { GoogleIcon, FacebookIcon, MoonIcon, UsersIcon, BuildingIcon } from '../components/icons';
import GlassCard from '../components/GlassCard';
import { supabase } from '../lib/supabaseClient';

type RegistrationData = { rentalGoal: RentalGoal; city: string; locality: string };
type PublicationData = { property_type: PropertyType; city: string; locality: string };

interface LoginPageProps {
  onLogin: (user: User) => void;
  onRegister: (userData: Partial<User>, password?: string, role?: UserRole) => void;
  onHomeClick: () => void;
  onOwnersClick: () => void;
  registrationData?: RegistrationData | null;
  publicationData?: PublicationData | null;
  initialMode: 'login' | 'register';
  onBlogClick: () => void;
  onAboutClick: () => void;
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  onContactClick: () => void;
  onRegisterClick: () => void;
}

const LoginPage: React.FC<LoginPageProps> = (props) => {
  const { onLogin, onRegister, onHomeClick, onOwnersClick, registrationData, publicationData, initialMode, ...footerProps } = props;
  
  const isGuidedRegisterMode = !!registrationData || !!publicationData;
  
  const [mode, setMode] = useState(isGuidedRegisterMode ? 'register' : initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.INQUILINO);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(isGuidedRegisterMode ? 'register' : initialMode);
  }, [initialMode, isGuidedRegisterMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'register') {
        if (!name || !age || !email || !password) {
            setError("Por favor, completa todos los campos.");
            setLoading(false);
            return;
        }
        await onRegister({ email, name, age: parseInt(age, 10) }, password, isGuidedRegisterMode ? undefined : selectedRole);
    } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (signInError) {
            setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
        } else if (data.user) {
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();
            
            if (profileError) {
                setError("No se pudo encontrar el perfil de usuario asociado a esta cuenta.");
                await supabase.auth.signOut();
            } else if (profileData) {
                if ((profileData as User).is_banned) {
                    setError('Esta cuenta ha sido suspendida.');
                    await supabase.auth.signOut();
                } else {
                    onLogin(profileData as User);
                }
            }
        }
    }
    setLoading(false);
  };

  const getSubtitle = () => {
    if (mode === 'register') {
        if(publicationData) return `Estás a un paso de publicar tu ${publicationData.property_type.toLowerCase()} en ${publicationData.locality}.`;
        if(registrationData) return `Crea tu cuenta para empezar a buscar en ${registrationData.locality}.`
        return 'Únete a MoOn para encontrar tu match perfecto.';
    }
    return 'Inicia sesión para continuar en tu espacio.';
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white flex flex-col">
      <Header onLoginClick={() => setMode('login')} onRegisterClick={() => setMode('register')} onHomeClick={onHomeClick} onOwnersClick={onOwnersClick} pageContext={publicationData ? 'propietario' : 'inquilino'} />
      <main className="flex-grow flex items-center justify-center p-4">
        <GlassCard className="w-full max-w-md">
          <div className="text-center mb-8">
            <MoonIcon className="w-12 h-12 mx-auto text-indigo-400" />
            <h2 className="text-3xl font-bold mt-4">{mode === 'register' ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}</h2>
            <p className="text-white/70 mt-2">{getSubtitle()}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                {!isGuidedRegisterMode && (
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Quiero registrarme como:</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setSelectedRole(UserRole.INQUILINO)} className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${selectedRole === UserRole.INQUILINO ? 'bg-indigo-500/30 border-indigo-400' : 'bg-white/10 border-transparent hover:border-white/30'}`}>
                        <UsersIcon className="w-8 h-8 mb-2" />
                        <span className="font-semibold">Inquilino</span>
                      </button>
                      <button type="button" onClick={() => setSelectedRole(UserRole.PROPIETARIO)} className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${selectedRole === UserRole.PROPIETARIO ? 'bg-indigo-500/30 border-indigo-400' : 'bg-white/10 border-transparent hover:border-white/30'}`}>
                        <BuildingIcon className="w-8 h-8 mb-2" />
                        <span className="font-semibold">Propietario</span>
                      </button>
                    </div>
                  </div>
                )}
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

            <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-indigo-800 disabled:cursor-not-allowed">
              {loading ? 'Cargando...' : mode === 'register' ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </button>
            
            <div className="text-center text-sm">
                {mode === 'login' ? (
                    <p className="text-white/70">¿No tienes cuenta? <button type="button" onClick={() => { setMode('register'); setError('') }} className="font-semibold text-indigo-400 hover:underline">Regístrate</button></p>
                ) : (
                    <p className="text-white/70">¿Ya tienes cuenta? <button type="button" onClick={() => { setMode('login'); setError('') }} className="font-semibold text-indigo-400 hover:underline">Inicia sesión</button></p>
                )}
            </div>

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
        </GlassCard>
      </main>
      <Footer {...props} />
    </div>
  );
};

export default LoginPage;