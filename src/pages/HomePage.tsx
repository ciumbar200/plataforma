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
        question: '¿Cómo funciona el algoritmo de compatibilidad?',
        answer: 'Nuestro algoritmo analiza docenas de puntos de datos sobre tu estilo de vida, hábitos, horarios e intereses para asignarte una puntuación de compatibilidad con otros usuarios. ¡Es como un matchmaking para tu futuro hogar!',
    },
    {
        question: '¿Es MoOn gratuito para los inquilinos?',
        answer: 'Sí, crear tu perfil, buscar compañeros y propiedades, y hacer match es completamente gratuito para inquilinos. Ofreceremos funciones premium opcionales en el futuro.',
    },
    {
        question: '¿Qué pasa si tengo un problema con mi compañero de piso?',
        answer: 'Aunque nuestro objetivo es crear matches perfectos, entendemos que pueden surgir problemas. Ofrecemos recursos de mediación y guías de convivencia para ayudarte a resolver cualquier conflicto de manera amistosa.',
    },
];

const HomePage: React.FC<HomePageProps> = ({ onLoginClick, onRegisterClick, onStartRegistration, onOwnersClick, onBlogClick, onAboutClick, onPrivacyClick, onTermsClick, onContactClick }) => {
    const [rentalGoal, setRentalGoal] = useState<RentalGoal | ''>('');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedLocality, setSelectedLocality] = useState<string>('');
    const [localities, setLocalities] = useState<string[]>([]);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
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
                <section className="relative pt-16 pb-24 sm:pt-20 sm:pb-32 text-center overflow-hidden">
                    <div 
                        className="absolute inset-0 w-full h-full bg-cover bg-top sm:bg-center opacity-40 scale-110"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')" }}
                        aria-hidden="true"
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 to-indigo-900/80" aria-hidden="true"></div>
                    <div className="relative z-10 max-w-4xl mx-auto px-4">
                        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
                            Vive Digno. Vive Seguro. <br/>Vive Acompañado.
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto text-white/80">
                            Encuentra compañeros de piso compatibles y propiedades increíbles. Di adiós a las convivencias incómodas.
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
                <section className="py-20">
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
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="p-6 pt-0 text-white/80">
                                            <p>{faq.answer}</p>
                                        </div>
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