import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import { UsersIcon, ShieldCheckIcon, HeartIcon } from '../components/icons';

interface SilverPageProps {
    onHomeClick: () => void;
    onLoginClick: () => void;
    onRegisterClick: () => void;
    onOwnersClick: () => void;
    onBlogClick: () => void;
    onAboutClick: () => void;
    onPrivacyClick: () => void;
    onTermsClick: () => void;
    onContactClick: () => void;
    onSilverClick: () => void;
}

const Feature: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <GlassCard className="text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/20">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/30 mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/70">{children}</p>
    </GlassCard>
);

const SilverPage: React.FC<SilverPageProps> = (props) => {
    const { onRegisterClick, ...headerFooterProps } = props;

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white flex flex-col">
            <Header onLoginClick={props.onLoginClick} onRegisterClick={onRegisterClick} onHomeClick={props.onHomeClick} onOwnersClick={props.onOwnersClick} onSilverClick={props.onSilverClick} pageContext="inquilino" />
            
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-20 pb-20 sm:pt-24 sm:pb-32 text-center overflow-hidden">
                    <div 
                        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop')" }}
                        aria-hidden="true"
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-indigo-900/80" aria-hidden="true"></div>
                    <div className="relative z-10 max-w-4xl mx-auto px-4">
                        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white animate-fade-in-up">
                           MoOn Silver: Viviendas compartidas con servicios <span className="text-cyan-300">premium</span> para mayores de 60 años
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto text-white/80 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Vivir acompañado, con tranquilidad y servicios adaptados a tus necesidades.
                        </p>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-black/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Feature icon={<UsersIcon className="w-7 h-7 text-cyan-300" />} title="Comunidad Silver">
                                Conecta con personas afines en tu misma etapa vital. Fomentamos la convivencia, el apoyo mutuo y la creación de lazos de amistad duraderos.
                            </Feature>
                             <Feature icon={<ShieldCheckIcon className="w-7 h-7 text-cyan-300" />} title="Servicios Integrados">
                                Disfruta de la comodidad. Ofrecemos servicios opcionales de limpieza, asistencia ligera y seguridad 24/7 para tu total tranquilidad.
                            </Feature>
                             <Feature icon={<HeartIcon className="w-7 h-7 text-cyan-300" />} title="Bienestar y Actividades">
                                Participa en un programa de actividades sociales, de ocio y salud diseñado para mantener un estilo de vida activo y saludable en buena compañía.
                            </Feature>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20">
                    <div className="max-w-3xl mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold">Da el paso hacia una nueva forma de vivir</h2>
                        <p className="text-lg text-white/70 mt-4 mb-8">
                            Regístrate hoy y descubre perfiles de personas compatibles con las que compartir esta nueva etapa de tu vida.
                        </p>
                        <button onClick={onRegisterClick} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/50 text-lg">
                            Únete a MoOn Silver
                        </button>
                    </div>
                </section>
            </main>

            <Footer {...headerFooterProps} />
        </div>
    );
};

export default SilverPage;