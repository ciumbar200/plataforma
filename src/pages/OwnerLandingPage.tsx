import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import { 
    DocumentTextIcon, 
    ShieldCheckIcon, 
    SparklesIcon, 
    SignatureIcon,
    ChevronLeftIcon
} from '../components/icons';
import { PropertyType } from '../types';
import { CITIES_DATA, getSupabaseUrl } from '../constants';


interface OwnerLandingPageProps {
    onStartPublication: (data: { property_type: PropertyType; city: string; locality: string }) => void;
    onHomeClick: () => void;
    onLoginClick: () => void;
    onOwnersClick: () => void;
    onBlogClick: () => void;
    onAboutClick: () => void;
    onPrivacyClick: () => void;
    onTermsClick: () => void;
    onContactClick: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <GlassCard>
        <div className="flex-shrink-0 mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/70">{children}</p>
    </GlassCard>
);

const testimonials = [
    {
        quote: "Publiqué un viernes y el domingo ya tenía visitas programadas. Firmamos en una semana.",
        author: "María G.",
        details: "Barcelona - Piso 3 hab.",
        img: getSupabaseUrl('avatars', 'testimonial01.webp')
    },
    {
        quote: "Me encantó el filtro de compatibilidad. Menos ruido, mejores candidatos.",
        author: "Jordi R.",
        details: "Valencia - Ático 2 hab.",
        img: getSupabaseUrl('avatars', 'testimonial02.webp')
    },
    {
        quote: "Proceso claro y digital. Contrato, depósito y pagos sin papel.",
        author: "Ana L.",
        details: "Madrid - Loft",
        img: getSupabaseUrl('avatars', 'testimonial03.webp')
    }
];

const OwnerLandingPage: React.FC<OwnerLandingPageProps> = ({ onStartPublication, onHomeClick, onLoginClick, onOwnersClick, onBlogClick, onAboutClick, onPrivacyClick, onTermsClick, onContactClick }) => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [propertyType, setPropertyType] = useState<PropertyType | ''>('');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedLocality, setSelectedLocality] = useState<string>('');
    const [localities, setLocalities] = useState<string[]>([]);

     useEffect(() => {
        if (selectedCity && CITIES_DATA[selectedCity]) {
            const cityLocalities = CITIES_DATA[selectedCity];
            setLocalities(cityLocalities);
            setSelectedLocality('');
        } else {
            setLocalities([]);
            setSelectedLocality('');
        }
    }, [selectedCity]);
    
     const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!propertyType || !selectedCity || !selectedLocality) {
            alert('Por favor, completa todos los campos para continuar.');
            return;
        }
        onStartPublication({ property_type: propertyType, city: selectedCity, locality: selectedLocality });
    };

    const nextTestimonial = () => {
        setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white flex flex-col">
            <Header onLoginClick={onLoginClick} onHomeClick={onHomeClick} onOwnersClick={onOwnersClick} />
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative py-16 sm:py-32 text-center overflow-hidden">
                     <div 
                        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-50 blur-sm scale-110"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop')" }}
                        aria-hidden="true"
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 to-indigo-900/70" aria-hidden="true"></div>
                    <div className="relative z-10 max-w-4xl mx-auto px-4">
                        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
                            Consigue inquilinos <span className="text-cyan-400">fiables</span> sin estrés
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl max-w-3xl mx-auto text-white/80">
                            Verificamos identidad y solvencia, filtramos candidatos y te traemos <strong>compañeros compatibles</strong> para tu vivienda. Publicar es <strong>gratis</strong> y sin exclusividad.
                        </p>
                        <GlassCard className="mt-10 max-w-4xl mx-auto !p-4 !bg-white/10">
                             <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-2 text-left">
                                <div className="w-full">
                                    <label htmlFor="property_type" className="text-xs text-white/70">Tipo de Propiedad</label>
                                    <select id="property_type" value={propertyType} onChange={(e) => setPropertyType(e.target.value as PropertyType)} className={`w-full bg-transparent font-semibold focus:outline-none ${!propertyType ? 'text-white/60' : 'text-white'}`}>
                                        <option value="" disabled>Tipo de propiedad</option>
                                        {Object.values(PropertyType).map(type => <option key={type} value={type} className="bg-gray-800 text-white">{type}</option>)}
                                    </select>
                                </div>
                                <div className="w-px h-10 bg-white/20 hidden md:block"></div>
                                <div className="w-full">
                                    <label htmlFor="city" className="text-xs text-white/70">Ciudad</label>
                                    <select id="city" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className={`w-full bg-transparent font-semibold focus:outline-none ${!selectedCity ? 'text-white/60' : 'text-white'}`}>
                                        <option value="" disabled>Ciudad</option>
                                        {Object.keys(CITIES_DATA).map(city => <option key={city} value={city} className="bg-gray-800 text-white">{city}</option>)}
                                    </select>
                                </div>
                                <div className="w-px h-10 bg-white/20 hidden md:block"></div>
                                <div className="w-full">
                                    <label htmlFor="locality" className="text-xs text-white/70">Localidad</label>
                                     <select id="locality" value={selectedLocality} onChange={(e) => setSelectedLocality(e.target.value)} disabled={!selectedCity} className={`w-full bg-transparent font-semibold focus:outline-none disabled:cursor-not-allowed ${!selectedLocality ? 'text-white/60' : 'text-white'}`}>
                                        <option value="" disabled>Localidad</option>
                                        {localities.map(loc => <option key={loc} value={loc} className="bg-gray-800 text-white">{loc}</option>)}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full md:w-auto bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap"
                                >
                                    Empezar a Publicar
                                </button>
                            </form>
                        </GlassCard>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-black/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold">Todo lo que un propietario necesita</h2>
                            <p className="text-lg text-white/70 mt-2">Servicio completo, limpio, rápido y transparente.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <FeatureCard icon={<DocumentTextIcon className="w-10 h-10 text-cyan-400" />} title="Publicación en 2 minutos">Sube fotos, define renta y reglas de la casa. Nosotros nos encargamos del resto.</FeatureCard>
                            <FeatureCard icon={<ShieldCheckIcon className="w-10 h-10 text-cyan-400" />} title="Verificación y scoring">Comprobación de identidad e ingresos, filtros anti-fraude y perfiles compatibles.</FeatureCard>
                            <FeatureCard icon={<SparklesIcon className="w-10 h-10 text-cyan-400" />} title="Match inteligente">Algoritmo que prioriza convivencia: hábitos, horarios, aficiones y compatibilidad.</FeatureCard>
                            <FeatureCard icon={<SignatureIcon className="w-10 h-10 text-cyan-400" />} title="Contrato y firma online">Plantillas legales y firma electrónica. Opcional: seguro de impago y depósito digital.</FeatureCard>
                        </div>
                    </div>
                </section>
                
                {/* How it works */}
                <section id="como-funciona" className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold">Cómo funciona</h2>
                            <p className="text-lg text-white/70 mt-2">Un flujo sencillo para alquilar rápido y seguro.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <GlassCard className="relative"><span className="absolute top-4 right-4 text-3xl font-bold text-white/20">1</span><h3 className="text-xl font-bold mb-2">Publica tu vivienda</h3><p className="text-white/70">Gratis y sin exclusividad. Cuéntanos condiciones y preferencias.</p></GlassCard>
                            <GlassCard className="relative"><span className="absolute top-4 right-4 text-3xl font-bold text-white/20">2</span><h3 className="text-xl font-bold mb-2">Recibe candidatos verificados</h3><p className="text-white/70">Te enviamos perfiles con verificación y compatibilidad.</p></GlassCard>
                            <GlassCard className="relative"><span className="absolute top-4 right-4 text-3xl font-bold text-white/20">3</span><h3 className="text-xl font-bold mb-2">Firma y cobra</h3><p className="text-white/70">Contrato digital, opción de seguro y cobro mensual automatizado.</p></GlassCard>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-20 bg-black/10">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold">Propietarios que ya confían</h2>
                            <p className="text-lg text-white/70 mt-2">Historias reales de cierres rápidos y buena convivencia.</p>
                        </div>
                        <div className="relative flex items-center justify-center">
                            <button onClick={prevTestimonial} className="absolute left-0 -translate-x-12 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors hidden md:block" aria-label="Anterior testimonio"><ChevronLeftIcon className="w-6 h-6"/></button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[-1, 0, 1].map(offset => {
                                    const index = (currentTestimonial + offset + testimonials.length) % testimonials.length;
                                    const testimonial = testimonials[index];
                                    const isCenter = offset === 0;
                                    return (
                                        <GlassCard key={index} className={`transition-all duration-300 ${isCenter ? 'scale-100 opacity-100' : 'scale-90 opacity-60 hidden md:block'}`}>
                                            <p className="italic mb-4">"{testimonial.quote}"</p>
                                            <div className="flex items-center gap-3">
                                                <img src={testimonial.img} alt={testimonial.author} className="w-10 h-10 rounded-full object-cover"/>
                                                <div>
                                                    <p className="font-bold">{testimonial.author}</p>
                                                    <p className="text-sm text-white/70">{testimonial.details}</p>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    );
                                })}
                            </div>
                            <button onClick={nextTestimonial} className="absolute right-0 translate-x-12 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors hidden md:block" aria-label="Siguiente testimonio"><ChevronLeftIcon className="w-6 h-6 rotate-180"/></button>
                        </div>
                         <div className="flex md:hidden justify-center gap-8 mt-8">
                            <button onClick={prevTestimonial} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Anterior testimonio"><ChevronLeftIcon className="w-6 h-6"/></button>
                            <button onClick={nextTestimonial} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Siguiente testimonio"><ChevronLeftIcon className="w-6 h-6 rotate-180"/></button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer 
                onBlogClick={onBlogClick} 
                onAboutClick={onAboutClick}
                onPrivacyClick={onPrivacyClick}
                onTermsClick={onTermsClick}
                onContactClick={onContactClick}
            />
        </div>
    );
};

export default OwnerLandingPage;