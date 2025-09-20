import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import { HeartIcon } from '../components/icons';
import { getSupabaseUrl } from '../constants';

interface PageProps {
  onHomeClick: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onBlogClick: () => void;
  onAboutClick: () => void;
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  onContactClick: () => void;
}

const TeamMemberCard: React.FC<{ imgSrc: string; name: string; title: string; }> = ({ imgSrc, name, title }) => (
    <div className="text-center">
        <img src={imgSrc} alt={name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white/20 object-cover"/>
        <h4 className="text-xl font-bold text-white">{name}</h4>
        <p className="text-indigo-300">{title}</p>
    </div>
);

const AboutPage: React.FC<PageProps> = ({ onHomeClick, onLoginClick, onRegisterClick, onBlogClick, onAboutClick, onPrivacyClick, onTermsClick, onContactClick }) => {
    
    const footerProps = { onBlogClick, onAboutClick, onPrivacyClick, onTermsClick, onContactClick };
    
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white flex flex-col">
            <Header onLoginClick={onLoginClick} onRegisterClick={onRegisterClick} onHomeClick={onHomeClick} pageContext="inquilino" />
            
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="py-20 text-center">
                    <div className="max-w-4xl mx-auto px-4">
                        <h1 className="text-5xl font-extrabold tracking-tight text-white">
                            Creemos en un mundo donde todos encuentran su lugar.
                        </h1>
                        <p className="mt-6 text-xl max-w-3xl mx-auto text-white/80">
                           MoOn nació de una idea simple: la convivencia no debería ser una lotería. Usamos la tecnología para crear conexiones humanas reales y hogares felices.
                        </p>
                    </div>
                </section>
                
                {/* Our Mission */}
                <section className="py-20 bg-black/10">
                    <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-4">Nuestra Misión</h2>
                            <p className="text-white/80 mb-4">
                                ¿Cuántas historias de terror sobre compañeros de piso has oído? Nosotros, demasiadas. Desde el que nunca limpia hasta el que organiza fiestas los martes. Sabíamos que tenía que haber una forma mejor.
                            </p>
                            <p className="text-white/80">
                                MoOn es nuestra respuesta. No somos solo un portal de anuncios; somos un servicio de matchmaking para la convivencia. Nuestra misión es erradicar las malas experiencias de alquiler compartido, conectando a las personas no solo por un espacio, sino por compatibilidad de estilo de vida.
                            </p>
                        </div>
                        <GlassCard>
                            <img src={getSupabaseUrl('property-media', 'about-mission.webp')} alt="Equipo colaborando" className="rounded-lg"/>
                        </GlassCard>
                    </div>
                </section>

                {/* Meet the team */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold">Conoce al Equipo</h2>
                            <p className="text-lg text-white/70 mt-2">Apasionados por la tecnología, el diseño y las buenas vibras.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
                            <TeamMemberCard imgSrc={getSupabaseUrl('avatars', '01.webp')} name="Elena Rodríguez" title="Fundadora & CEO" />
                            <TeamMemberCard imgSrc={getSupabaseUrl('avatars', '02.webp')} name="Javier Moreno" title="Líder de Tecnología" />
                            <TeamMemberCard imgSrc={getSupabaseUrl('avatars', '03.webp')} name="Carlos Pérez" title="Gestor de Comunidad" />
                        </div>
                    </div>
                </section>
                
                 {/* CTA Section */}
                <section className="py-20 bg-black/10">
                    <div className="max-w-3xl mx-auto px-4 text-center">
                        <HeartIcon className="w-12 h-12 text-indigo-400 mx-auto mb-4"/>
                        <h2 className="text-4xl font-bold">Únete a la revolución de la convivencia</h2>
                        <p className="text-lg text-white/70 mt-4 mb-8">
                            Ya seas inquilino buscando tu tribu o propietario buscando tranquilidad, tu match perfecto te está esperando.
                        </p>
                        <button onClick={onRegisterClick} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg text-lg">
                            Empezar ahora
                        </button>
                    </div>
                </section>

            </main>
            
            <Footer {...footerProps} />
        </div>
    );
};

export default AboutPage;