import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CompassIcon, UsersIcon, BuildingIcon, ChevronDownIcon, PencilIcon, SearchIcon, SignatureIcon, ChevronLeftIcon } from '../components/icons';
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

const testimonials = [
    {
        quote: "Encontré a mi compañera de piso y un apartamento increíble en menos de una semana. La compatibilidad era del 92% y ¡realmente se nota! MoOn hizo que todo el proceso fuera súper fácil y divertido.",
        author: "Elena Rodríguez",
        details: "Estudiante de Diseño, Madrid",
        img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&fit=crop'
    },
    {
        quote: "Después de mi divorcio, la idea de vivir solo era abrumadora. En MoOn no solo encontré a alguien con quien compartir gastos, sino a un gran amigo. Alquilamos un piso juntos y ha sido la mejor decisión.",
        author: "Carlos V.",
        details: "Profesional divorciado, Barcelona",
        img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&fit=crop'
    },
    {
        quote: "Se nos fue un compañero de piso y no sabíamos a quién meter. Publicamos la habitación en MoOn y en tres días encontramos a la persona perfecta, ¡y con una compatibilidad del 95%! Nos salvó.",
        author: "Sofía M. y amigos",
        details: "Grupo de piso, Valencia",
        img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&fit=crop'
    },
    {
        quote: "Como estudiante, encontrar un piso asequible cerca de la universidad era una pesadilla. MoOn me conectó con otros estudiantes en mi misma situación y ahora compartimos un piso genial.",
        author: "David L.",
        details: "Estudiante de Ingeniería, Sevilla",
        img: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=200&h=200&fit=crop'
    },
    {
        quote: "Trabajo desde casa y necesitaba un compañero de piso tranquilo y con horarios similares. El filtro de 'Estilo de Vida' fue clave. ¡He encontrado la paz que necesitaba!",
        author: "Ana P.",
        details: "Freelance, Madrid",
        img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&fit=crop'
    }
];

const Feature: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <GlassCard className="text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/20">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/30 mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/70">{children}</p>
    </GlassCard>
);

const faqs = [
    {
        question: '¿Qué es MoOn?',
        answer: '<p>MoOn es una plataforma de matching inteligente que conecta personas con valores y estilos de vida compatibles para compartir piso de forma segura, justa y sin especulación.</p>',
    },
    {
        question: '¿Cómo funciona el “Matching Inteligente”?',
        answer: "<p>Cuando te registras, completas un perfil con tus hábitos y preferencias. Nuestro algoritmo analiza tu información para sugerirte dos caminos:</p><ul class='list-disc list-inside mt-2 space-y-1'><li><strong>Buscar \"Compañeros y Piso\":</strong> Primero encuentras personas compatibles, formáis un grupo y luego buscáis juntos una propiedad para alquilar desde cero.</li><li><strong>Buscar \"Habitación en Piso\":</strong> Te unes a un piso que ya está formado y tiene una habitación libre.</li></ul><p class='mt-2'>Así reducimos el riesgo de conflictos y creamos comunidades más felices.</p>",
    },
    {
        question: '¿Cuánto cuesta usar MoOn?',
        answer: "<ul class='list-disc list-inside space-y-1'><li><strong>Registro y creación de perfil:</strong> Gratis.</li><li><strong>Suscripción Premium:</strong> 10 €/mes, que incluye contratos legales, scoring antifraude, seguro y comunidad exclusiva.</li></ul><p class='text-sm mt-2 text-white/60'>(En la mayoría de ciudades, es menos de lo que pagarías en comisiones de una agencia tradicional).</p>",
    },
    {
        question: '¿Qué seguridad tengo al alquilar?',
        answer: "<ul class='list-disc list-inside space-y-1'><li>Contratos legales y verificados.</li><li>Seguro de impago, robo y reubicación.</li><li>Scoring antifraude de inquilinos y propietarios.</li><li>Pagos transparentes y digitales.</li></ul>",
    },
    {
        question: '¿Cómo funciona el contrato?',
        answer: "<ul class='list-disc list-inside space-y-1'><li>Cada contrato está adaptado a la ley local.</li><li>Los gastos comunes se reparten según metros cuadrados ocupados, para evitar especulación.</li><li>Cada inquilino firma con el propietario, garantizando legalidad y transparencia.</li></ul>",
    },
    {
        question: '¿Los gastos (agua, luz, gas, internet) están incluidos?',
        answer: "<p>Depende del propietario. En cada anuncio verás claramente:</p><ul class='list-disc list-inside mt-2 space-y-1'><li>Piso con gastos incluidos.</li><li>Piso donde los gastos se reparten entre los inquilinos.</li></ul>",
    },
    {
        question: '¿Puedo elegir con quién voy a vivir?',
        answer: "<p>¡Sí! Antes de cerrar un contrato, puedes:</p><ul class='list-disc list-inside mt-2 space-y-1'><li>Ver perfiles verificados de tus futuros compañeros.</li><li>Revisar su porcentaje de compatibilidad contigo.</li><li>Decidir si quieres convivir con ellos.</li></ul>",
    },
    {
        question: '¿Necesito pagar comisión a una agencia?',
        answer: "<p>No. MoOn elimina las comisiones abusivas:</p><ul class='list-disc list-inside mt-2 space-y-1'><li>Trato directo con el propietario.</li><li>Sin intermediarios innecesarios.</li><li>Solo pagas tu suscripción a MoOn.</li></ul>",
    },
    {
        question: '¿Soy estudiante, puedo usar MoOn?',
        answer: "<p>Claro. MoOn está diseñado para:</p><ul class='list-disc list-inside mt-2 space-y-1'><li>Estudiantes universitarios.</li><li>Jóvenes profesionales.</li><li>Personas recién separadas.</li><li>Trabajadores en movilidad laboral.</li></ul>",
    },
    {
        question: '¿Dónde puedo encontrar pisos con MoOn?',
        answer: "<p>Actualmente en:</p><ul class='list-disc list-inside mt-2 space-y-1'><li>Barcelona y principales ciudades de España.</li></ul><p class='mt-2'>Próximamente: Francia, Alemania y Reino Unido.</p>",
    },
    {
        question: '¿Cuánto tiempo se tarda en encontrar piso?',
        answer: '<p>En promedio, los usuarios compatibles encuentran piso en menos de 2 semanas, gracias al matching.</p>',
    },
    {
        question: '¿Qué pasa con mis datos?',
        answer: "<p>Tu información personal está protegida con encriptación.</p><ul class='list-disc list-inside mt-2 space-y-1'><li>No compartimos tus datos sin permiso.</li><li>Cumplimos con RGPD en toda Europa.</li></ul>",
    },
    {
        question: '¿Cómo sé que un anuncio es real?',
        answer: "<p>Todos los propietarios pasan por un proceso de verificación. Además:</p><ul class='list-disc list-inside mt-2 space-y-1'><li>MoOn bloquea fraudes y anuncios falsos.</li><li>Ofrecemos soporte si detectas algo sospechoso.</li></ul>",
    },
    {
        question: '¿Qué pasa si no me adapto al piso?',
        answer: "<p>Si la convivencia no funciona:</p><ul class='list-disc list-inside mt-2 space-y-1'><li>Seguro de reubicación.</li><li>Te ayudamos a encontrar una nueva vivienda sin perder tu dinero.</li></ul>",
    },
    {
        question: '¿Qué ventajas tengo frente a Idealista, Badi u otras plataformas?',
        answer: "<ul class='list-disc list-inside space-y-1'><li>MoOn no es solo un portal de anuncios.</li><li>Tenemos algoritmo de compatibilidad, seguros y comunidad.</li><li>Cuidamos tanto de inquilinos como de propietarios.</li></ul>",
    },
    {
        question: '¿Puedo alquilar solo una habitación?',
        answer: '<p>Sí. Puedes alquilar una habitación o compartir un piso completo con otros usuarios de MoOn.</p>',
    },
    {
        question: '¿Qué pasa si no pago a tiempo?',
        answer: "<p>El contrato establece plazos claros.</p><ul class='list-disc list-inside mt-2 space-y-1'><li>Con el seguro de impago, el propietario está protegido.</li><li>Tú también puedes evitar penalizaciones si comunicas con anticipación.</li></ul>",
    },
    {
        question: '¿Hay soporte si tengo dudas?',
        answer: "<p>Sí, nuestro equipo te atiende:</p><ul class='list-disc list-inside mt-2 space-y-1'><li>Chat online en la web/app.</li><li>Soporte por email.</li><li>Ayuda 24/7 en incidencias urgentes.</li></ul>",
    },
];

const HomePage: React.FC<HomePageProps> = ({ onLoginClick, onRegisterClick, onStartRegistration, onOwnersClick, onBlogClick, onAboutClick, onPrivacyClick, onTermsClick, onContactClick }) => {
    const [rentalGoal, setRentalGoal] = useState<RentalGoal | ''>('');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedLocality, setSelectedLocality] = useState<string>('');
    const [localities, setLocalities] = useState<string[]>([]);
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const nextTestimonial = () => {
        setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
    };

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
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white flex flex-col">
            <Header onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} onHomeClick={() => {}} onOwnersClick={onOwnersClick} pageContext="inquilino" />
            
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-20 pb-20 sm:pt-24 sm:pb-32 text-center overflow-hidden">
                    <div 
                        className="absolute inset-0 w-full h-full bg-cover bg-top sm:bg-center opacity-60 scale-110"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')" }}
                        aria-hidden="true"
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 to-indigo-900/70" aria-hidden="true"></div>
                    <div className="relative z-10 max-w-4xl mx-auto px-4">
                        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
                            <span className="block animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Vive Digno.</span>
                            <span className="block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Vive Seguro.</span>
                            <span className="block animate-fade-in-up" style={{ animationDelay: '0.3s' }}>Vive Acompañado.</span>
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto text-white/80 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            Encuentra compañeros de piso compatibles y propiedades increíbles. Di adiós a las convivencias incómodas.
                        </p>
                        
                        <form onSubmit={handleSubmit} className="mt-10 max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                           <GlassCard className="!bg-white/20">
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
                                            <option value={RentalGoal.FIND_ROOMMATES_AND_APARTMENT} className="bg-gray-800 text-white">Compañeros y piso</option>
                                            <option value={RentalGoal.FIND_ROOM_WITH_ROOMMATES} className="bg-gray-800 text-white">Habitación en piso</option>
                                            <option value={RentalGoal.BOTH} className="bg-gray-800 text-white">Ambas opciones</option>
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
                                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-purple-500/50 transform hover:-translate-y-0.5"
                                    >
                                        <SearchIcon className="w-5 h-5" />
                                        <span>Buscar</span>
                                    </button>
                                </div>
                            </GlassCard>
                        </form>

                        <div className="mt-8 flex flex-col items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                            <div className="flex -space-x-2">
                                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Usuario 1"/>
                                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1550525811-e586910b323f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Usuario 2"/>
                                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Usuario 3"/>
                            </div>
                            <p className="text-sm text-white/80"><span className="font-bold text-white">Únete a +10,000 Mooners</span> encontrando su hogar ideal.</p>
                        </div>
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
                            <GlassCard className="relative text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/20">
                                <span className="absolute top-4 right-4 text-5xl font-bold text-white/10">1</span>
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/30 mb-4">
                                    <PencilIcon className="w-7 h-7 text-indigo-300" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Crea tu Perfil</h3>
                                <p className="text-white/70">Define tu estilo de vida, hábitos e intereses. Nuestro algoritmo usa esta información para encontrar tu match perfecto.</p>
                            </GlassCard>
                            <GlassCard className="relative text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/20">
                                <span className="absolute top-4 right-4 text-5xl font-bold text-white/10">2</span>
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/30 mb-4">
                                    <SearchIcon className="w-7 h-7 text-indigo-300" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Descubre y Conecta</h3>
                                <p className="text-white/70">Explora perfiles de compañeros y propiedades compatibles. Envía "me gusta" y haz match con tus favoritos.</p>
                            </GlassCard>
                             <GlassCard className="relative text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/20">
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
                
                {/* Testimonial Carousel Section */}
                <section className="py-20 bg-black/10">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-2">Historias Reales, Conexiones Reales</h2>
                        <p className="text-white/70 mb-10 max-w-2xl mx-auto">
                            Descubre por qué cientos de personas confían en MoOn para encontrar su hogar y sus compañeros de piso ideales.
                        </p>
                        <GlassCard className="!p-8 relative overflow-hidden min-h-[320px] flex items-center justify-center">
                            <div className="relative w-full h-full">
                                {testimonials.map((testimonial, index) => (
                                    <div
                                        key={index}
                                        className={`transition-opacity duration-500 ease-in-out absolute inset-0 flex flex-col justify-center items-center ${index === currentTestimonial ? 'opacity-100' : 'opacity-0'}`}
                                    >
                                        <img 
                                            src={testimonial.img} 
                                            alt={testimonial.author} 
                                            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-400"
                                        />
                                        <blockquote className="text-xl italic text-white/90 max-w-2xl mx-auto">
                                            "{testimonial.quote}"
                                        </blockquote>
                                        <cite className="mt-4 block font-bold not-italic">{testimonial.author}</cite>
                                        <p className="text-sm text-white/70">{testimonial.details}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <button 
                                onClick={prevTestimonial}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
                                aria-label="Anterior testimonio"
                            >
                                <ChevronLeftIcon className="w-6 h-6"/>
                            </button>
                            <button 
                                onClick={nextTestimonial}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
                                aria-label="Siguiente testimonio"
                            >
                                <ChevronLeftIcon className="w-6 h-6 rotate-180"/>
                            </button>
                            
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {testimonials.map((_, index) => (
                                    <button 
                                        key={index} 
                                        onClick={() => setCurrentTestimonial(index)}
                                        className={`w-2 h-2 rounded-full transition-colors ${index === currentTestimonial ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
                                        aria-label={`Ir al testimonio ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </GlassCard>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="py-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center mb-2">Preguntas Frecuentes</h2>
                        <p className="text-center text-white/70 mb-10">¿Tienes dudas? Aquí resolvemos las más comunes.</p>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <GlassCard key={index} className="!p-0 overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                        className="w-full flex justify-between items-center text-left p-6"
                                    >
                                        <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                                        <ChevronDownIcon className={`w-6 h-6 text-white/70 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="p-6 pt-0 text-white/80 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                    </div>
                                </GlassCard>
                            ))}
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
                onOwnersClick={onOwnersClick}
            />
        </div>
    );
};

export default HomePage;