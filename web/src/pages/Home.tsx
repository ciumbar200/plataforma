import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CityLocalities {
  [key: string]: string[];
}

const cityLocalities: CityLocalities = {
  Barcelona: ['Eixample', 'Gràcia', 'Ciutat Vella', 'Sants-Montjuïc', 'Les Corts', 'Sarrià-Sant Gervasi'],
  Madrid: ['Centro', 'Chamberí', 'Retiro', 'Salamanca', 'Chamartín', 'Malasaña'],
  Valencia: ['Ciutat Vella', 'Eixample', 'Extramurs', 'Campanar', 'La Saïdia', 'Poblats Marítims'],
  Sevilla: ['Casco Antiguo', 'Triana', 'Macarena', 'Nervión', 'Este-Alcosa-Torreblanca', 'Sur'],
  Bilbao: ['Casco Viejo', 'Ensanche', 'Deusto', 'Uribarri', 'Otxarkoaga-Txurdinaga', 'Basurto-Zorroza']
};

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [availableLocalities, setAvailableLocalities] = useState<string[]>([]);

  useEffect(() => {
    if (selectedCity && cityLocalities[selectedCity]) {
      setAvailableLocalities(cityLocalities[selectedCity]);
      setSelectedLocality('');
    } else {
      setAvailableLocalities([]);
      setSelectedLocality('');
    }
  }, [selectedCity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCity && selectedLocality && selectedRole) {
      // Redirigir según el rol seleccionado
      if (selectedRole === 'propietario') {
        navigate('/owner/dashboard');
      } else if (selectedRole === 'mooner') {
        navigate('/tenant/browse');
      }
    }
  };

  const getRoleBasedContent = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'PROPIETARIO':
        return {
          title: 'Panel de Propietario',
          description: 'Gestiona tus propiedades y encuentra los mejores inquilinos',
          actions: [
            { label: 'Mis Propiedades', path: '/owner/properties', gradient: 'from-blue-500 to-purple-600' },
            { label: 'Dashboard', path: '/owner/dashboard', gradient: 'from-purple-500 to-pink-600' }
          ]
        };
      case 'INQUILINO':
        return {
          title: 'Encuentra tu Hogar',
          description: 'Descubre propiedades perfectas y conecta con compañeros ideales',
          actions: [
            { label: 'Buscar Propiedades', path: '/tenant/browse', gradient: 'from-green-500 to-blue-600' },
            { label: 'Mis Matches', path: '/tenant/properties', gradient: 'from-cyan-500 to-blue-600' }
          ]
        };
      case 'ADMIN':
        return {
          title: 'Panel de Administración',
          description: 'Controla y gestiona toda la plataforma MoOn Pro',
          actions: [
            { label: 'Dashboard Admin', path: '/admin', gradient: 'from-red-500 to-orange-600' }
          ]
        };
      default:
        return null;
    }
  };

  const roleContent = getRoleBasedContent();

  return (
    <div className="min-h-screen" style={{
      background: `
        radial-gradient(1200px 800px at 20% -10%, rgba(124,58,237,.35), transparent 60%),
        radial-gradient(1200px 800px at 120% 110%, rgba(34,211,238,.25), transparent 60%),
        linear-gradient(160deg, #0f172a, #1e293b)
      `,
      padding: '24px'
    }}>
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="text-purple-400 text-sm font-semibold">MoOn Pro • Glass UI</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            Encuentra tu mejor opción
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            La plataforma más avanzada para conectar propietarios e inquilinos con tecnología de matching inteligente
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Form Card */}
          <div className="glass-card bg-white/7 backdrop-blur-lg border border-white/12 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-500/30 to-transparent rounded-full blur-2xl"></div>
            
            <h2 className="text-2xl font-bold mb-2 text-white">Selecciona tu preferencia</h2>
            <p className="text-gray-400 mb-6 text-sm">Elige ciudad, localidad y tu rol para continuar.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Ciudad */}
                <div className="space-y-2">
                  <label htmlFor="ciudad" className="text-sm text-gray-400">
                    Ciudad <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="ciudad"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full p-3 bg-white/8 border border-white/16 rounded-xl text-white focus:border-purple-500/70 focus:ring-4 focus:ring-purple-500/15 focus:bg-white/12 transition-all outline-none"
                    required
                  >
                    <option value="" disabled>Elegir ciudad…</option>
                    <option value="Barcelona">Barcelona</option>
                    <option value="Madrid">Madrid</option>
                    <option value="Valencia">Valencia</option>
                    <option value="Sevilla">Sevilla</option>
                    <option value="Bilbao">Bilbao</option>
                  </select>
                  <span className="text-xs text-gray-500">Esto define las localidades disponibles.</span>
                </div>

                {/* Localidad */}
                <div className="space-y-2">
                  <label htmlFor="localidad" className="text-sm text-gray-400">
                    Localidad <span className="text-red-400">*</span>
                  </label>
                  <select
                    id="localidad"
                    value={selectedLocality}
                    onChange={(e) => setSelectedLocality(e.target.value)}
                    disabled={!selectedCity}
                    className="w-full p-3 bg-white/8 border border-white/16 rounded-xl text-white focus:border-purple-500/70 focus:ring-4 focus:ring-purple-500/15 focus:bg-white/12 transition-all outline-none disabled:opacity-50"
                    required
                  >
                    <option value="">
                      {selectedCity ? 'Selecciona localidad…' : 'Selecciona ciudad primero…'}
                    </option>
                    {availableLocalities.map((locality) => (
                      <option key={locality} value={locality}>{locality}</option>
                    ))}
                  </select>
                  <span className="text-xs text-gray-500">Se completa automáticamente según la ciudad.</span>
                </div>
              </div>

              {/* Rol */}
              <div className="space-y-2">
                <label htmlFor="rol" className="text-sm text-gray-400">
                  Rol <span className="text-red-400">*</span>
                </label>
                <select
                  id="rol"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full p-3 bg-white/8 border border-white/16 rounded-xl text-white focus:border-purple-500/70 focus:ring-4 focus:ring-purple-500/15 focus:bg-white/12 transition-all outline-none"
                  required
                >
                  <option value="" disabled>Selecciona tu rol…</option>
                  <option value="propietario">Propietario — Publicar propiedad</option>
                  <option value="mooner">Mooner — Busco compañero</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={!selectedCity || !selectedLocality || !selectedRole}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-cyan-600 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
                <button
                  type="button"
                  className="px-6 py-3 bg-transparent border border-white/18 text-gray-300 rounded-xl hover:bg-white/5 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>

          {/* Role-based Content */}
          {roleContent && (
            <div className="space-y-6">
              <div className="glass-card bg-white/7 backdrop-blur-lg border border-white/12 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-3 text-white">{roleContent.title}</h3>
                <p className="text-gray-400 mb-6">{roleContent.description}</p>
                
                <div className="space-y-3">
                  {roleContent.actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => navigate(action.path)}
                      className={`w-full p-4 bg-gradient-to-r ${action.gradient} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* User Info Card */}
              <div className="glass-card bg-white/7 backdrop-blur-lg border border-white/12 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  {user?.image && (
                    <img 
                      src={user.image} 
                      alt={user.name || 'Usuario'} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold text-white">{user?.name || 'Usuario'}</h4>
                    <p className="text-sm text-gray-400">{user?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center hover:bg-white/8 transition-all">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
            <h3 className="font-semibold text-white mb-2">Propiedades Verificadas</h3>
            <p className="text-gray-400 text-sm">Todas las propiedades pasan por un proceso de verificación riguroso</p>
          </div>
          
          <div className="glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center hover:bg-white/8 transition-all">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="font-semibold text-white mb-2">Matching Inteligente</h3>
            <p className="text-gray-400 text-sm">Algoritmo avanzado que conecta personas compatibles</p>
          </div>
          
          <div className="glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center hover:bg-white/8 transition-all">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="font-semibold text-white mb-2">Seguridad Total</h3>
            <p className="text-gray-400 text-sm">Verificación de identidad y protección de datos garantizada</p>
          </div>
        </div>
      </div>
    </div>
  );
}
