import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CompassIcon, UsersIcon, BuildingIcon, ChevronDownIcon, PencilIcon, SearchIcon, SignatureIcon } from '../components/icons';
import GlassCard from '../components/GlassCard';
import { RentalGoal } from '../types';
import { CITIES_DATA, getSupabaseUrl } from '../constants';

interface HomePageProps {
    onLoginClick: () => void;
    onRegisterClick: () => void;
    onStartRegistration: (data: { rentalGoal: RentalGoal; city: string; locality: string }) => void;
    onOwnersClick: () => void;
    onBlogClick: () => void;
    onAboutClick: () => void;
    onPrivacyClick: () => void;
    onTermsClick: () => void;
    onContactClick: () => void;
}

const Feature: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <GlassCard className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/30 mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/70">{children}</p>
    </GlassCard>
);

const HomePage: React.FC<HomePageProps> = ({ onLoginClick, onRegisterClick, onStartRegistration, onOwnersClick, onBlogClick, onAboutClick, onPrivacyClick, onTermsClick, onContactClick }) => {
    const [rentalGoal, setRentalGoal] = useState<RentalGoal | ''>('');
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
        if (!rentalGoal || !selectedCity || !selectedLocality) {
            alert('Por favor, completa todos los campos para continuar.');
            return;
        }
        onStartRegistration({ rentalGoal, city: selectedCity, locality: selectedLocality });
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white flex flex-col">
            <Header onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} onHomeClick={() => {}} onOwnersClick={onOwnersClick} pageContext="inquilino" />
            
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative py-24 sm:py-32 text-center overflow-hidden">
                    <div 
                        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30 blur-md scale-110"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop')" }}
                        aria-hidden="true"
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 to-indigo-900/80" aria-hidden="true"></div>
                    <div className="relative z-10 max-w-4xl mx-auto px-4">
                        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
                            Encuentra tu Match Perfecto. De Piso y de Vida.
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto text-white/80">
                            MoOn es la plataforma que te conecta con compañeros de piso compatibles y propiedades increíbles. Di adiós a las convivencias incómodas.
                        </p>
                        
                        <form onSubmit={handleSubmit} className="mt-10 max-w-5xl mx-auto">
                           <GlassCard className="!bg-white/10">
                                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                                    {/* Rental Goal Select */}
                                    <div className="relative w-full md:w-64">
                                        <select 
                                            id="rentalGoal" 
                                            value={rentalGoal} 
                                            onChange={(e) => setRentalGoal(e.target.value as RentalGoal)} 
                                            className={`w-full appearance-none bg-purple-600/40 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 pr-10 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all ${!rentalGoal ? 'text-white/70' : 'text-white'}`}
                                        >
                                            <option value="" disabled>Busco...</option>
                                            <option value={RentalGoal.FIND_ROOMMATES_AND_APARTMENT} className="bg-gray-800 text-white">Busco otro mooner y alquilar juntos</option>
                                            <option value={RentalGoal.FIND_ROOM_WITH_ROOMMATES} className="bg-gray-800 text-white">Busco habitación justa</option>
                                            <option value={RentalGoal.BOTH} className="bg-gray-800 text-white">Las dos coisas</option>
                                        </select>
                                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/80 pointer-events-none" />
                                    </div>

                                    {/* City Select */}
                                    <div className="relative w-full md:w-64">
                                        <select 
                                            id="city" 
                                            value={selectedCity} 
                                            onChange={(e) => setSelectedCity(e.target.value)}
                                            className={`w-full appearance-none bg-purple-600/40 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 pr-10 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all ${!selectedCity ? 'text-white/70' : 'text-white'}`}
                                        >
                                            <option value="" disabled>Ciudad</option>
                                            {Object.keys(CITIES_DATA).map(city => <option key={city} value={city} className="bg-gray-800 text-white">{city}</option>)}
                                        </select>
                                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/80 pointer-events-none" />
                                    </div>

                                    {/* Locality Select */}
                                    <div className="relative w-full md:w-64">
                                        <select 
                                            id="locality" 
                                            value={selectedLocality} 
                                            onChange={(e) => setSelectedLocality(e.target.value)} 
                                            disabled={!selectedCity}
                                            className={`w-full appearance-none bg-purple-600/40 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 pr-10 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all disabled:cursor-not-allowed ${!selectedLocality ? 'text-white/70' : 'text-white'}`}
                                        >
                                            <option value="" disabled>Localidad</option>
                                            {localities.map(loc => <option key={loc} value={loc} className="bg-gray-800 text-white">{loc}</option>)}
                                        </select>
                                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/80 pointer-events-none" />
                                    </div>
                                    
                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg"
                                    >
                                        Buscar
                                    </button>
                                </div>
                            </GlassCard>
                        </form>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-black/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center mb-12">¿Por qué MoOn?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Feature icon={<UsersIcon className="w-7 h-7 text-indigo-300" />} title="Match por Compatibilidad">
                                Nuestro algoritmo avanzado analiza tu estilo de vida, hábitos e intereses para encontrar los compañeros de piso más compatibles.
                            </Feature>
                             <Feature icon={<BuildingIcon className="w-7 h-7 text-indigo-300" />} title="Propiedades Verificadas">
                                Explora un listado curado de pisos y habitaciones. Cada propiedad es revisada por nuestro equipo para garantizar calidad y seguridad.
                            </Feature>
                             <Feature icon={<CompassIcon className="w-7 h-7 text-indigo-300" />} title="Búsqueda Inteligente">
                                Filtra por ubicación, precio, servicios y hasta por el ambiente que buscas en tu nuevo hogar. Tu casa ideal está a solo unos clics.
                            </Feature>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="como-funciona" className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center mb-12">Cómo Funciona para Inquilinos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <GlassCard className="relative text-center">
                                <span className="absolute top-4 right-4 text-5xl font-bold text-white/10">1</span>
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/30 mb-4">
                                    <PencilIcon className="w-7 h-7 text-indigo-300" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Crea tu Perfil</h3>
                                <p className="text-white/70">Define tu estilo de vida, hábitos e intereses. Nuestro algoritmo usa esta información para encontrar tu match perfecto.</p>
                            </GlassCard>
                            <GlassCard className="relative text-center">
                                <span className="absolute top-4 right-4 text-5xl font-bold text-white/10">2</span>
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/30 mb-4">
                                    <SearchIcon className="w-7 h-7 text-indigo-300" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Descubre y Conecta</h3>
                                <p className="text-white/70">Explora perfiles de compañeros y propiedades compatibles. Envía "me gusta" y haz match con tus favoritos.</p>
                            </GlassCard>
                             <GlassCard className="relative text-center">
                                <span className="absolute top-4 right-4 text-5xl font-bold text-white/10">3</span>
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/30 mb-4">
                                    <SignatureIcon className="w-7 h-7 text-indigo-300" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Firma y Múdate</h3>
                                <p className="text-white/70">Chatea con tus matches, organiza visitas y formaliza el acuerdo. Tu nuevo hogar te espera.</p>
                            </GlassCard>
                        </div>
                    </div>
                </section>
                
                {/* Testimonial Section */}
                <section className="py-20 bg-black/10">
                    <div className="max-w-3xl mx-auto px-4 text-center">
                        <img 
                            src={getSupabaseUrl('avatars', 'testimonial01.webp')} 
                            alt="Elena Rodríguez" 
                            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-400"
                        />
                        <blockquote className="text-xl italic text-white/90">
                            "Encontré a mi compañera de piso y un apartamento increíble en menos de una semana. La compatibilidad era del 92% y ¡realmente se nota! MoOn hizo que todo el proceso fuera súper fácil y divertido."
                        </blockquote>
                        <cite className="mt-4 block font-bold not-italic">- Elena Rodríguez, usuaria de MoOn</cite>
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

export default HomePage;