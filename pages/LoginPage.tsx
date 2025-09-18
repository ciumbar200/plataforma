import React, { useState, useEffect, useRef } from 'react';
// FIX: Added PropertyType to the import to use in the component's props.
import { User, RentalGoal, UserRole, PropertyType } from '../types';
import { CITIES_DATA } from '../constants';
import { GoogleIcon, MoonIcon, ChevronLeftIcon } from '../components/icons';
import GlassCard from '../components/GlassCard';
import { supabase } from '../lib/supabaseClient';

interface LoginPageProps {
  onBack: () => void;
  // FIX: Updated the type for initialData to correctly handle both tenant and owner registration flows.
  initialData?: (Partial<User> & { propertyType?: PropertyType }) | null;
  registrationRole: UserRole.INQUILINO | UserRole.PROPIETARIO;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, initialData, registrationRole }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  
  const [formData, setFormData] = useState({
      rentalGoal: initialData?.rentalGoal || RentalGoal.FIND_ROOM_WITH_ROOMMATES,
      city: initialData?.city || 'Madrid',
      locality: initialData?.locality || CITIES_DATA['Madrid'][0],
      name: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      privacyPolicy: false,
  });

  useEffect(() => {
    if (initialData?.rentalGoal || initialData?.propertyType) {
        setMode('register');
        if (registrationRole === UserRole.INQUILINO) setStep(2);
    }
  }, [initialData, registrationRole]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    setFormData(prev => ({ ...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value }));
  };
   const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const city = e.target.value;
      const firstLocality = CITIES_DATA[city]?.[0] || '';
      setFormData(prev => ({ ...prev, city, locality: firstLocality }));
  }
  
  const handleNextStep = () => setStep(prev => prev + 1);
  const handlePrevStep = () => setStep(prev => prev - 1);

  const handleGoogleSignIn = async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { error } = await (supabase.auth as any).signInWithOAuth({
      provider: 'google',
    });
    if (error) {
        setError(error.message);
        setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { error } = await (supabase.auth as any).signInWithPassword({
        email: loginData.email,
        password: loginData.password,
    });
    if (error) setError(error.message);
    setLoading(false);
    // onAuthStateChange in App.tsx will handle navigation
  };
  
 const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
    }
    if (!formData.privacyPolicy) {
        setError("Debes aceptar la política de privacidad para continuar.");
        return;
    }

    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
    });

    if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
    }

    if (data.user) {
        // Now, explicitly insert the full profile into the 'profiles' table.
        const profileData = {
            id: data.user.id,
            email: data.user.email,
            name: formData.name,
            last_name: formData.lastName,
            phone: formData.phone,
            city: formData.city,
            locality: formData.locality,
            rental_goal: registrationRole === UserRole.INQUILINO ? formData.rentalGoal : null,
            role: registrationRole,
            age: 18, // Default age, user can change later
            noise_level: 'Medio', // Default noise level
            avatar_url: `https://i.pravatar.cc/200?u=${data.user.id}` // Default avatar
        };

        const { error: profileError } = await supabase.from('profiles').insert(profileData);

        if (profileError) {
            setError(`Cuenta creada, pero hubo un error al guardar el perfil: ${profileError.message}. Contacta con soporte.`);
            setLoading(false);
        } else {
            alert("¡Registro completado! Ahora puedes iniciar sesión con tu nueva cuenta.");
            setMode('login'); // Switch to login form
            setLoading(false);
        }
    } else {
        setError("No se pudo crear el usuario. Por favor, inténtalo de nuevo.");
        setLoading(false);
    }
  };
  
  const renderLogin = () => (
    <>
      <div className="text-center">
        <MoonIcon className="w-12 h-12 mx-auto mb-2 text-indigo-400" />
        <h2 className="text-3xl font-bold">Bienvenido a MoOn</h2>
        <p className="text-white/70 mt-2">Encuentra tu compañero de piso y tu hogar ideal.</p>
      </div>
      <div className="my-8">
        <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-lg transition-colors border border-white/20">
            <GoogleIcon className="w-6 h-6" />
            <span>Continuar con Google</span>
        </button>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/20"></div></div>
        <div className="relative flex justify-center text-sm"><span className="bg-slate-900/90 px-2 text-white/60 backdrop-blur-sm rounded-full">O inicia sesión con tu email</span></div>
      </div>
      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <div>
            <label htmlFor="emailLogin" className="block text-sm font-medium text-white/80 mb-1">Email</label>
            <input type="email" name="email" id="emailLogin" value={loginData.email} onChange={handleLoginChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <div>
            <label htmlFor="passwordLogin" className="block text-sm font-medium text-white/80 mb-1">Contraseña</label>
            <input type="password" name="password" id="passwordLogin" value={loginData.password} onChange={handleLoginChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500" required />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
      </form>

       <p className="text-center mt-6 text-sm">
            ¿No tienes cuenta?{' '}
            <button onClick={() => { setMode('register'); setStep(1); }} className="font-semibold text-indigo-400 hover:underline">
                Regístrate aquí
            </button>
        </p>
    </>
  );
  
  const renderInquilinoRegisterStep1 = () => (
      <div className="space-y-4">
          <div>
              <label htmlFor="rentalGoal" className="block text-sm font-medium text-white/80 mb-1">¿Cuál es tu objetivo?</label>
              <select name="rentalGoal" id="rentalGoal" value={formData.rentalGoal} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value={RentalGoal.FIND_ROOM_WITH_ROOMMATES} className="bg-gray-800">Buscar habitación con compañeros</option>
                  <option value={RentalGoal.FIND_ROOMMATES_AND_APARTMENT} className="bg-gray-800">Buscar compañeros para un piso</option>
                  <option value={RentalGoal.BOTH} className="bg-gray-800">Ambas opciones</option>
              </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
              <div>
                  <label htmlFor="city" className="block text-sm font-medium text-white/80 mb-1">Ciudad</label>
                  <select name="city" id="city" value={formData.city} onChange={handleCityChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500">
                      {Object.keys(CITIES_DATA).map(city => <option key={city} value={city} className="bg-gray-800">{city}</option>)}
                  </select>
              </div>
              <div>
                  <label htmlFor="locality" className="block text-sm font-medium text-white/80 mb-1">Localidad</label>
                  <select name="locality" id="locality" value={formData.locality} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500">
                      {CITIES_DATA[formData.city]?.map(loc => <option key={loc} value={loc} className="bg-gray-800">{loc}</option>)}
                  </select>
              </div>
          </div>
          <button onClick={handleNextStep} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">Siguiente</button>
      </div>
  );

  const renderRegisterStep2 = (role: 'INQUILINO' | 'PROPIETARIO') => (
      <form onSubmit={handleRegistration} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
              <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">Nombre</label>
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-white/80 mb-1">Apellidos</label>
                  <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
          </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">Email</label>
                  <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-1">Teléfono</label>
                  <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
          </div>
          <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">Contraseña</label>
              <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-1">Repetir Contraseña</label>
              <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div className="flex items-start pt-2">
              <div className="flex items-center h-5">
                  <input id="privacyPolicy" name="privacyPolicy" type="checkbox" checked={formData.privacyPolicy} onChange={handleChange} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-white/30 rounded bg-white/10" />
              </div>
              <div className="ml-3 text-sm">
                  <label htmlFor="privacyPolicy" className="text-white/80">He leído y acepto la <a href="#" className="font-medium text-indigo-400 hover:underline">Política de Privacidad</a>.</label>
              </div>
          </div>
          <div className="flex gap-4 pt-2">
              {role === 'INQUILINO' && <button type="button" onClick={handlePrevStep} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-lg transition-colors">Atrás</button>}
              <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50">
                  {loading ? 'Registrando...' : 'Finalizar Registro'}
              </button>
          </div>
      </form>
  );

  const renderRegister = () => {
       const isTenant = registrationRole === UserRole.INQUILINO;
       return (
           <>
                <div className="text-center">
                    <h2 className="text-3xl font-bold">Crea tu Perfil de {isTenant ? 'Inquilino' : 'Propietario'}</h2>
                    <p className="text-white/70 mt-2">{isTenant ? `Paso ${step} de 2` : 'Publica tu propiedad y encuentra al inquilino ideal.'}</p>
                </div>
                <div className="my-6">
                    <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-lg transition-colors border border-white/20">
                        <GoogleIcon className="w-6 h-6" />
                        <span>Registrarse con Google</span>
                    </button>
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/20"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="bg-slate-900/90 px-2 text-white/60 backdrop-blur-sm rounded-full">O completa manualmente</span></div>
                    </div>
                    {isTenant ? (
                        <>
                            {step === 1 && renderInquilinoRegisterStep1()}
                            {step === 2 && renderRegisterStep2('INQUILINO')}
                        </>
                    ) : (
                        renderRegisterStep2('PROPIETARIO')
                    )}
                </div>
                <p className="text-center mt-6 text-sm">
                    ¿Ya tienes cuenta?{' '}
                    <button onClick={() => setMode('login')} className="font-semibold text-indigo-400 hover:underline">
                        Inicia sesión
                    </button>
                </p>
           </>
       );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white flex flex-col items-center justify-center p-4 relative">
      <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors z-10 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
        <ChevronLeftIcon className="w-5 h-5" />
        <span>Volver al Inicio</span>
      </button>

      <GlassCard className="w-full max-w-lg">
        {error && <div className="bg-red-500/30 border border-red-500 text-red-300 p-3 rounded-lg mb-4 text-center">{error}</div>}
        {mode === 'login' ? renderLogin() : renderRegister()}
      </GlassCard>
    </div>
  );
};

export default LoginPage;