
import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OwnerLandingPage from './pages/OwnerLandingPage';
import TenantDashboard from './dashboards/TenantDashboard';
import OwnerDashboard from './dashboards/OwnerDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import AccountLayout from './pages/account/AccountLayout';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';
import { User, Property, BlogPost, SavedSearch, UserRole, RentalGoal, PropertyType, Notification, NotificationType, OwnerStats } from './types';
import { supabase } from './lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

// --- MOCK DATA ---

const MOCK_USERS: User[] = [
  { id: '1', name: 'Elena Rodriguez', email: 'elena@example.com', age: 28, profilePicture: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=200&h=200&fit=crop', city: 'Madrid', locality: 'Centro', interests: ['Yoga', 'Cocina Vegana', 'Viajar', 'Fotografía'], noiseLevel: 'Bajo', compatibility: 0, role: UserRole.INQUILINO, rentalGoal: RentalGoal.FIND_ROOM_WITH_ROOMMATES, bio: 'Busco un lugar tranquilo para vivir y compartir buenas conversaciones. Me encanta el arte y salir a tomar fotos por la ciudad.', lifestyle: ['Creativo', 'Tranquilo'], commuteDistance: 30, isBanned: false },
  { id: '2', name: 'Carlos Pérez', email: 'carlos@example.com', age: 31, profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&fit=crop', city: 'Madrid', locality: 'Chamberí', interests: ['Senderismo', 'Música Indie', 'Videojuegos', 'Cine'], noiseLevel: 'Medio', compatibility: 0, role: UserRole.INQUILINO, rentalGoal: RentalGoal.FIND_ROOMMATES_AND_APARTMENT, bio: 'Ingeniero de software. En mi tiempo libre me gusta desconectar en la naturaleza o jugar a la PS5. Busco compis para compartir piso y alguna cerveza.', lifestyle: ['Nocturno', 'Intelectual'], commuteDistance: 20, isBanned: false },
  { id: '3', name: 'Ana García', email: 'ana@example.com', age: 26, profilePicture: 'https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?q=80&w=200&h=200&fit=crop', city: 'Barcelona', locality: 'Gràcia', interests: ['Lectura', 'Teatro', 'Museos', 'Brunch'], noiseLevel: 'Bajo', compatibility: 0, role: UserRole.INQUILINO, rentalGoal: RentalGoal.BOTH, bio: 'Soy periodista y me encanta la vida cultural de la ciudad. Busco un hogar acogedor con gente respetuosa y con quien poder charlar de vez en cuando.', lifestyle: ['Diurno', 'Social'], commuteDistance: 45, isBanned: false },
  { id: '4', name: 'Javier Moreno', email: 'javier.owner@example.com', age: 42, profilePicture: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&h=200&fit=crop', city: 'Valencia', locality: 'Ruzafa', role: UserRole.PROPIETARIO, interests: [], noiseLevel: 'Medio', compatibility: 0, age: 42, bio: 'Propietario de varios inmuebles en Valencia. Busco inquilinos responsables y a largo plazo.' },
  { id: '5', name: 'Admin', email: 'admin@moon.com', age: 35, profilePicture: 'https://i.pravatar.cc/200?u=admin', city: 'Madrid', role: UserRole.ADMIN, interests: [], noiseLevel: 'Medio', compatibility: 0, bio: 'Administrador del sistema.' },
];

const MOCK_PROPERTIES: Property[] = [
    { id: 1, owner_id: '4', title: 'Piso luminoso en Chamberí', address: 'Calle de Almagro, 20', city: 'Madrid', locality: 'Chamberí', postalCode: '28010', propertyType: PropertyType.FLAT, imageUrls: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800'], price: 1400, visibility: 'Pública', views: 2345, compatibleCandidates: 12, availableFrom: '2024-08-01', lat: 40.430, lng: -3.693, status: 'approved', features: { wifi: true, airConditioning: true, heating: true, kitchen: true, elevator: true, furnished: true } },
    { id: 2, owner_id: '4', title: 'Habitación con balcón en Gràcia', address: 'Carrer de Verdi, 50', city: 'Barcelona', locality: 'Gràcia', postalCode: '08012', propertyType: PropertyType.ROOM, imageUrls: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800'], price: 550, visibility: 'Pública', views: 5870, compatibleCandidates: 34, availableFrom: '2024-09-01', lat: 41.403, lng: 2.154, status: 'approved', features: { wifi: true, furnished: true, kitchen: true, washingMachine: true, balcony: true } },
    { id: 3, owner_id: '4', title: 'Estudio moderno en Ruzafa', address: 'Carrer de Sueca, 30', city: 'Valencia', locality: 'Ruzafa', postalCode: '46004', propertyType: PropertyType.STUDIO, imageUrls: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800'], price: 800, visibility: 'Pública', views: 1230, compatibleCandidates: 8, availableFrom: '2024-08-15', lat: 39.462, lng: -0.373, status: 'pending', conditions: 'Estancia mínima de 1 año. Se requiere un mes de fianza.' },
];

const MOCK_BLOG_POSTS: BlogPost[] = [
    { id: 1, slug: '10-consejos-convivencia', title: '10 consejos para una convivencia feliz con tus compañeros de piso', excerpt: 'Descubre las claves para evitar conflictos y disfrutar de una experiencia increíble compartiendo piso.', imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800', content: '<h2>Introducción</h2><p>Vivir con compañeros de piso puede ser una de las experiencias más enriquecedoras de tu vida, pero también puede presentar desafíos...</p>', author: 'El equipo de MoOn', authorImageUrl: 'https://i.pravatar.cc/100?u=moon', publish_date: '2024-07-20T10:00:00Z' },
    { id: 2, slug: 'decorar-habitacion-pequena', title: 'Cómo decorar una habitación pequeña para que parezca más grande', excerpt: 'Aprovecha cada rincón de tu espacio con estos trucos de decoración inteligentes y económicos.', imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800', content: '<h2>El poder de los colores claros</h2><p>Pintar las paredes de colores claros como el blanco, beige o gris pálido es el truco más antiguo y efectivo...</p>', author: 'Ana García', authorImageUrl: MOCK_USERS[2].profilePicture, publish_date: '2024-07-15T10:00:00Z' },
];

const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 1, userId: '1', type: NotificationType.NEW_MATCH, message: '¡Has hecho match con Carlos Pérez!', timestamp: new Date().toISOString(), read: false },
    { id: 2, userId: '4', type: NotificationType.PROPERTY_INQUIRY, message: 'Elena Rodríguez está interesada en tu "Piso luminoso en Chamberí".', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
    { id: 3, userId: '1', type: NotificationType.SYSTEM_ALERT, message: 'Hemos actualizado nuestra Política de Privacidad. Revísala.', timestamp: new Date(Date.now() - 86400000).toISOString(), read: true },
];

// --- APP COMPONENT ---

type ViewState = 
    | { view: 'home' }
    | { view: 'owner_landing' }
    | { view: 'login'; registrationData?: any; registrationRole: UserRole.INQUILINO | UserRole.PROPIETARIO }
    | { view: 'tenant_dashboard' }
    | { view: 'owner_dashboard' }
    | { view: 'admin_dashboard' }
    | { view: 'account_settings'; initialTab?: string }
    | { view: 'blog' }
    | { view: 'about' }
    | { view: 'privacy' }
    | { view: 'terms' }
    | { view: 'contact' };

const App: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [viewState, setViewState] = useState<ViewState>({ view: 'home' });

    // Mock data state
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>(MOCK_BLOG_POSTS);
    const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
    const [userMatches, setUserMatches] = useState<string[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            const user = session?.user ? users.find(u => u.email === session.user.email) || null : null;
            setCurrentUser(user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            const user = session?.user ? users.find(u => u.email === session.user.email) || null : null;
            setCurrentUser(user);
        });

        return () => subscription.unsubscribe();
    }, [users]);
    
    useEffect(() => {
        if (currentUser) {
            switch(currentUser.role) {
                case UserRole.INQUILINO: setViewState({ view: 'tenant_dashboard' }); break;
                case UserRole.PROPIETARIO: setViewState({ view: 'owner_dashboard' }); break;
                case UserRole.ADMIN: setViewState({ view: 'admin_dashboard' }); break;
                default: setViewState({ view: 'home' });
            }
        } else {
            // Keep current view if not logged in, unless it's a protected view
            if (['tenant_dashboard', 'owner_dashboard', 'admin_dashboard', 'account_settings'].includes(viewState.view)) {
                 setViewState({ view: 'home' });
            }
        }
    }, [currentUser]);

    // --- Handlers ---
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
        setViewState({ view: 'home' });
    };
    
    const handleStartRegistration = (data: any) => {
        const isTenant = 'rentalGoal' in data;
        setViewState({ view: 'login', registrationData: data, registrationRole: isTenant ? UserRole.INQUILINO : UserRole.PROPIETARIO });
    };

    const handleSaveProperty = (propertyData: Omit<Property, 'id' | 'views' | 'compatibleCandidates' | 'owner_id'> & { id?: number }) => {
        setProperties(prev => {
            if (propertyData.id) {
                return prev.map(p => p.id === propertyData.id ? { ...p, ...propertyData, price: Number(propertyData.price) } : p);
            }
            const newProperty: Property = {
                ...propertyData,
                id: Math.max(...prev.map(p => p.id)) + 1,
                price: Number(propertyData.price),
                owner_id: currentUser!.id,
                views: 0,
                compatibleCandidates: 0,
            };
            return [...prev, newProperty];
        });
    };

    const handleUpdateUser = (updatedUser: User) => {
        const updated = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        setUsers(updated);
        if (currentUser && currentUser.id === updatedUser.id) {
            setCurrentUser(updatedUser);
        }
    }

    const renderView = () => {
        switch (viewState.view) {
            case 'home': return <HomePage onLoginClick={() => setViewState({ view: 'login', registrationRole: UserRole.INQUILINO })} onStartRegistration={handleStartRegistration} onOwnersClick={() => setViewState({ view: 'owner_landing' })} onBlogClick={() => setViewState({ view: 'blog' })} onAboutClick={() => setViewState({ view: 'about' })} onPrivacyClick={() => setViewState({ view: 'privacy' })} onTermsClick={() => setViewState({ view: 'terms' })} onContactClick={() => setViewState({ view: 'contact' })} />;
            case 'owner_landing': return <OwnerLandingPage onStartPublication={handleStartRegistration} onHomeClick={() => setViewState({ view: 'home' })} onLoginClick={() => setViewState({ view: 'login', registrationRole: UserRole.PROPIETARIO })} onBlogClick={() => setViewState({ view: 'blog' })} onAboutClick={() => setViewState({ view: 'about' })} onPrivacyClick={() => setViewState({ view: 'privacy' })} onTermsClick={() => setViewState({ view: 'terms' })} onContactClick={() => setViewState({ view: 'contact' })} />;
            case 'login': return <LoginPage onBack={() => setViewState({ view: 'home' })} initialData={viewState.registrationData} registrationRole={viewState.registrationRole} />;
            case 'tenant_dashboard': return currentUser && <TenantDashboard user={currentUser} allUsers={users} properties={properties} onSendInterest={() => {}} savedSearches={savedSearches} onSaveSearch={() => {}} onDeleteSearch={() => {}} userMatches={userMatches} onAddMatch={() => {}} onGoToAccountSettings={() => setViewState({ view: 'account_settings', initialTab: 'profile' })}/>;
            case 'owner_dashboard': return currentUser && <OwnerDashboard user={currentUser} properties={properties.filter(p => p.owner_id === currentUser?.id)} onSaveProperty={handleSaveProperty} initialPropertyData={null} onClearInitialPropertyData={()=>{}} />;
            case 'admin_dashboard': return <AdminDashboard users={users} properties={properties} blogPosts={blogPosts} onUpdatePropertyStatus={()=>{}} onDeleteProperty={()=>{}} onSetUserBanStatus={()=>{}} onSaveBlogPost={()=>{}} onDeleteBlogPost={()=>{}} onLogout={handleLogout}/>;
            case 'account_settings': return currentUser && <AccountLayout user={currentUser} onUpdateUser={handleUpdateUser} onLogout={handleLogout} onBack={() => setViewState({ view: currentUser.role === UserRole.INQUILINO ? 'tenant_dashboard' : 'owner_dashboard'})} onBlogClick={() => setViewState({ view: 'blog' })} onAboutClick={() => setViewState({ view: 'about' })} onPrivacyClick={() => setViewState({ view: 'privacy' })} onTermsClick={() => setViewState({ view: 'terms' })} onContactClick={() => setViewState({ view: 'contact' })} initialTab={viewState.initialTab} />;
            case 'blog': return <BlogPage posts={blogPosts} onHomeClick={() => setViewState({ view: 'home' })} onLoginClick={() => setViewState({ view: 'login', registrationRole: UserRole.INQUILINO })} onAboutClick={() => setViewState({ view: 'about' })} onPrivacyClick={() => setViewState({ view: 'privacy' })} onTermsClick={() => setViewState({ view: 'terms' })} onContactClick={() => setViewState({ view: 'contact' })} />;
            case 'about': return <AboutPage onHomeClick={() => setViewState({ view: 'home' })} onLoginClick={() => setViewState({ view: 'login', registrationRole: UserRole.INQUILINO })} onBlogClick={() => setViewState({ view: 'blog' })} onAboutClick={() => setViewState({ view: 'about' })} onPrivacyClick={() => setViewState({ view: 'privacy' })} onTermsClick={() => setViewState({ view: 'terms' })} onContactClick={() => setViewState({ view: 'contact' })} />;
            case 'privacy': return <PrivacyPolicyPage onHomeClick={() => setViewState({ view: 'home' })} onLoginClick={() => setViewState({ view: 'login', registrationRole: UserRole.INQUILINO })} onBlogClick={() => setViewState({ view: 'blog' })} onAboutClick={() => setViewState({ view: 'about' })} onPrivacyClick={() => setViewState({ view: 'privacy' })} onTermsClick={() => setViewState({ view: 'terms' })} onContactClick={() => setViewState({ view: 'contact' })} />;
            case 'terms': return <TermsPage onHomeClick={() => setViewState({ view: 'home' })} onLoginClick={() => setViewState({ view: 'login', registrationRole: UserRole.INQUILINO })} onBlogClick={() => setViewState({ view: 'blog' })} onAboutClick={() => setViewState({ view: 'about' })} onPrivacyClick={() => setViewState({ view: 'privacy' })} onTermsClick={() => setViewState({ view: 'terms' })} onContactClick={() => setViewState({ view: 'contact' })} />;
            case 'contact': return <ContactPage onHomeClick={() => setViewState({ view: 'home' })} onLoginClick={() => setViewState({ view: 'login', registrationRole: UserRole.INQUILINO })} onBlogClick={() => setViewState({ view: 'blog' })} onAboutClick={() => setViewState({ view: 'about' })} onPrivacyClick={() => setViewState({ view: 'privacy' })} onTermsClick={() => setViewState({ view: 'terms' })} onContactClick={() => setViewState({ view: 'contact' })} />;
            default: return <div>Cargando...</div>;
        }
    };

    return <div className="h-screen w-screen bg-gray-900">{renderView()}</div>;
};

export default App;
