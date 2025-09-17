import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
const cityLocalities = {
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
    const [availableLocalities, setAvailableLocalities] = useState([]);
    useEffect(() => {
        if (selectedCity && cityLocalities[selectedCity]) {
            setAvailableLocalities(cityLocalities[selectedCity]);
            setSelectedLocality('');
        }
        else {
            setAvailableLocalities([]);
            setSelectedLocality('');
        }
    }, [selectedCity]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedCity && selectedLocality && selectedRole) {
            // Redirigir según el rol seleccionado
            if (selectedRole === 'propietario') {
                navigate('/owner/dashboard');
            }
            else if (selectedRole === 'mooner') {
                navigate('/tenant/browse');
            }
        }
    };
    const getRoleBasedContent = () => {
        if (!user)
            return null;
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
    return (_jsx("div", { className: "min-h-screen", style: {
            background: `
        radial-gradient(1200px 800px at 20% -10%, rgba(124,58,237,.35), transparent 60%),
        radial-gradient(1200px 800px at 120% 110%, rgba(34,211,238,.25), transparent 60%),
        linear-gradient(160deg, #0f172a, #1e293b)
      `,
            padding: '24px'
        }, children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("div", { className: "inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6", children: _jsx("span", { className: "text-purple-400 text-sm font-semibold", children: "MoOn Pro \u2022 Glass UI" }) }), _jsx("h1", { className: "text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent", children: "Encuentra tu mejor opci\u00F3n" }), _jsx("p", { className: "text-xl text-gray-300 mb-8 max-w-2xl mx-auto", children: "La plataforma m\u00E1s avanzada para conectar propietarios e inquilinos con tecnolog\u00EDa de matching inteligente" })] }), _jsxs("div", { className: "grid lg:grid-cols-2 gap-8 items-start", children: [_jsxs("div", { className: "glass-card bg-white/7 backdrop-blur-lg border border-white/12 rounded-2xl p-8 relative overflow-hidden", children: [_jsx("div", { className: "absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-500/30 to-transparent rounded-full blur-2xl" }), _jsx("h2", { className: "text-2xl font-bold mb-2 text-white", children: "Selecciona tu preferencia" }), _jsx("p", { className: "text-gray-400 mb-6 text-sm", children: "Elige ciudad, localidad y tu rol para continuar." }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("label", { htmlFor: "ciudad", className: "text-sm text-gray-400", children: ["Ciudad ", _jsx("span", { className: "text-red-400", children: "*" })] }), _jsxs("select", { id: "ciudad", value: selectedCity, onChange: (e) => setSelectedCity(e.target.value), className: "w-full p-3 bg-white/8 border border-white/16 rounded-xl text-white focus:border-purple-500/70 focus:ring-4 focus:ring-purple-500/15 focus:bg-white/12 transition-all outline-none", required: true, children: [_jsx("option", { value: "", disabled: true, children: "Elegir ciudad\u2026" }), _jsx("option", { value: "Barcelona", children: "Barcelona" }), _jsx("option", { value: "Madrid", children: "Madrid" }), _jsx("option", { value: "Valencia", children: "Valencia" }), _jsx("option", { value: "Sevilla", children: "Sevilla" }), _jsx("option", { value: "Bilbao", children: "Bilbao" })] }), _jsx("span", { className: "text-xs text-gray-500", children: "Esto define las localidades disponibles." })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { htmlFor: "localidad", className: "text-sm text-gray-400", children: ["Localidad ", _jsx("span", { className: "text-red-400", children: "*" })] }), _jsxs("select", { id: "localidad", value: selectedLocality, onChange: (e) => setSelectedLocality(e.target.value), disabled: !selectedCity, className: "w-full p-3 bg-white/8 border border-white/16 rounded-xl text-white focus:border-purple-500/70 focus:ring-4 focus:ring-purple-500/15 focus:bg-white/12 transition-all outline-none disabled:opacity-50", required: true, children: [_jsx("option", { value: "", children: selectedCity ? 'Selecciona localidad…' : 'Selecciona ciudad primero…' }), availableLocalities.map((locality) => (_jsx("option", { value: locality, children: locality }, locality)))] }), _jsx("span", { className: "text-xs text-gray-500", children: "Se completa autom\u00E1ticamente seg\u00FAn la ciudad." })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { htmlFor: "rol", className: "text-sm text-gray-400", children: ["Rol ", _jsx("span", { className: "text-red-400", children: "*" })] }), _jsxs("select", { id: "rol", value: selectedRole, onChange: (e) => setSelectedRole(e.target.value), className: "w-full p-3 bg-white/8 border border-white/16 rounded-xl text-white focus:border-purple-500/70 focus:ring-4 focus:ring-purple-500/15 focus:bg-white/12 transition-all outline-none", required: true, children: [_jsx("option", { value: "", disabled: true, children: "Selecciona tu rol\u2026" }), _jsx("option", { value: "propietario", children: "Propietario \u2014 Publicar propiedad" }), _jsx("option", { value: "mooner", children: "Mooner \u2014 Busco compa\u00F1ero" })] })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { type: "submit", disabled: !selectedCity || !selectedLocality || !selectedRole, className: "flex-1 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-cyan-600 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed", children: "Continuar" }), _jsx("button", { type: "button", className: "px-6 py-3 bg-transparent border border-white/18 text-gray-300 rounded-xl hover:bg-white/5 transition-all", children: "Cancelar" })] })] })] }), roleContent && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "glass-card bg-white/7 backdrop-blur-lg border border-white/12 rounded-2xl p-8", children: [_jsx("h3", { className: "text-2xl font-bold mb-3 text-white", children: roleContent.title }), _jsx("p", { className: "text-gray-400 mb-6", children: roleContent.description }), _jsx("div", { className: "space-y-3", children: roleContent.actions.map((action, index) => (_jsx("button", { onClick: () => navigate(action.path), className: `w-full p-4 bg-gradient-to-r ${action.gradient} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1`, children: action.label }, index))) })] }), _jsx("div", { className: "glass-card bg-white/7 backdrop-blur-lg border border-white/12 rounded-2xl p-6", children: _jsxs("div", { className: "flex items-center gap-4", children: [user?.image && (_jsx("img", { src: user.image, alt: user.name || 'Usuario', className: "w-12 h-12 rounded-full object-cover border-2 border-white/20" })), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-white", children: user?.name || 'Usuario' }), _jsx("p", { className: "text-sm text-gray-400", children: user?.role })] })] }) })] }))] }), _jsxs("div", { className: "mt-16 grid md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center hover:bg-white/8 transition-all", children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center", children: _jsx("span", { className: "text-2xl", children: "\uD83C\uDFE0" }) }), _jsx("h3", { className: "font-semibold text-white mb-2", children: "Propiedades Verificadas" }), _jsx("p", { className: "text-gray-400 text-sm", children: "Todas las propiedades pasan por un proceso de verificaci\u00F3n riguroso" })] }), _jsxs("div", { className: "glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center hover:bg-white/8 transition-all", children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center", children: _jsx("span", { className: "text-2xl", children: "\uD83E\uDD1D" }) }), _jsx("h3", { className: "font-semibold text-white mb-2", children: "Matching Inteligente" }), _jsx("p", { className: "text-gray-400 text-sm", children: "Algoritmo avanzado que conecta personas compatibles" })] }), _jsxs("div", { className: "glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center hover:bg-white/8 transition-all", children: [_jsx("div", { className: "w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mx-auto mb-4 flex items-center justify-center", children: _jsx("span", { className: "text-2xl", children: "\uD83D\uDD12" }) }), _jsx("h3", { className: "font-semibold text-white mb-2", children: "Seguridad Total" }), _jsx("p", { className: "text-gray-400 text-sm", children: "Verificaci\u00F3n de identidad y protecci\u00F3n de datos garantizada" })] })] })] }) }));
}
