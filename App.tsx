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
import { User, Property, BlogPost, SavedSearch, UserRole } from './types';
import { supabase } from './lib/supabaseClient';
import { MoonIcon } from './components/icons';

// --- MAPPERS ---
// Maps a profile from Supabase (snake_case) to a User object (camelCase)
const mapProfileToUser = (profile: any): User => ({
  id: profile.id,
  name: profile.name,
  email: profile.email,
  lastName: profile.last_name,
  phone: profile.phone,
  city: profile.city,
  locality: profile.locality,
  rentalGoal: profile.rental_goal,
  age: profile.age,
  profilePicture: profile.avatar_url,
  videoUrl: profile.video_url,
  interests: profile.interests || [],
  noiseLevel: profile.noise_level,
  compatibility: 0, // Should be calculated dynamically
  role: profile.role,
  bio: profile.bio,
  lifestyle: profile.lifestyle || [],
  commuteDistance: profile.commute_distance,
  isBanned: profile.is_banned,
});

const mapPropertyFromDb = (property: any): Property => ({
    ...property,
    imageUrls: property.image_urls || [],
    propertyType: property.property_type,
    availableFrom: property.available_from,
    postalCode: property.postal_code,
    compatibleCandidates: property.compatible_candidates,
});


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
    const [session, setSession] = useState<any | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [viewState, setViewState] = useState<ViewState>({ view: 'home' });
    const [loading, setLoading] = useState(true);

    // Data state, initialized as empty
    const [users, setUsers] = useState<User[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
    const [userMatches, setUserMatches] = useState<string[]>([]);

    // --- DATA FETCHING & AUTH ---

    useEffect(() => {
        const fetchAllData = async () => {
            const { data: profilesData } = await supabase.from('profiles').select('*');
            if (profilesData) setUsers(profilesData.map(mapProfileToUser));

            const { data: propertiesData } = await supabase.from('properties').select('*');
            if (propertiesData) setProperties(propertiesData.map(mapPropertyFromDb));
            
            // NOTE: Assuming blog_posts table exists. If not, this will fail silently.
            const { data: blogData } = await supabase.from('blog_posts').select('*');
            if (blogData) setBlogPosts(blogData);
        };

        const initialize = async () => {
            setLoading(true);
            await fetchAllData();
            
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            if (session) {
                const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                if (data) setCurrentUser(mapProfileToUser(data));
            }
            setLoading(false);
        };
        
        initialize();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            if (session) {
                 const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                 if (data) {
                    setCurrentUser(mapProfileToUser(data));
                 } else { // Profile might not exist yet if signup just happened
                    const freshUsers = await supabase.from('profiles').select('*');
                    if(freshUsers.data) {
                        const profile = freshUsers.data.find(p => p.id === session.user.id);
                        if(profile) setCurrentUser(mapProfileToUser(profile));
                    }
                 }
            } else {
                setCurrentUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (loading) return; // Don't navigate while loading
        if (currentUser) {
            switch(currentUser.role) {
                case UserRole.INQUILINO: setViewState({ view: 'tenant_dashboard' }); break;
                case UserRole.PROPIETARIO: setViewState({ view: 'owner_dashboard' }); break;
                case UserRole.ADMIN: setViewState({ view: 'admin_dashboard' }); break;
                default: setViewState({ view: 'home' });
            }
        } else {
            if (['tenant_dashboard', 'owner_dashboard', 'admin_dashboard', 'account_settings'].includes(viewState.view)) {
                 setViewState({ view: 'home' });
            }
        }
    }, [currentUser, loading]);

    // --- Handlers ---
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null); // This will trigger the useEffect above to navigate home
    };
    
    const handleStartRegistration = (data: any) => {
        const isTenant = 'rentalGoal' in data;
        setViewState({ view: 'login', registrationData: data, registrationRole: isTenant ? UserRole.INQUILINO : UserRole.PROPIETARIO });
    };

    const handleSaveProperty = async (propertyData: Omit<Property, 'id' | 'views' | 'compatibleCandidates' | 'owner_id'> & { id?: number }) => {
        const dbProperty = {
            ...propertyData,
            owner_id: currentUser!.id,
            price: Number(propertyData.price),
            image_urls: propertyData.imageUrls,
            property_type: propertyData.propertyType,
            available_from: propertyData.availableFrom,
            postal_code: propertyData.postalCode,
        };
        delete (dbProperty as any).imageUrls;
        delete (dbProperty as any).propertyType;
        delete (dbProperty as any).availableFrom;
        delete (dbProperty as any).postalCode;

        if (dbProperty.id) { // Update
            const { data, error } = await supabase.from('properties').update(dbProperty).eq('id', dbProperty.id).select().single();
            if (data) {
                setProperties(prev => prev.map(p => p.id === data.id ? mapPropertyFromDb(data) : p));
            }
        } else { // Insert
            delete (dbProperty as any).id;
             const { data, error } = await supabase.from('properties').insert(dbProperty).select().single();
            if (data) {
                setProperties(prev => [...prev, mapPropertyFromDb(data)]);
            }
        }
    };
    
    const handleUpdateUser = async (updatedUser: User) => {
        // A simplified update - only sends fields that are likely to change and exist in the DB
        const profileUpdate = {
            name: updatedUser.name,
            last_name: updatedUser.lastName,
            phone: updatedUser.phone,
            city: updatedUser.city,
            locality: updatedUser.locality,
            age: updatedUser.age,
            avatar_url: updatedUser.profilePicture,
            bio: updatedUser.bio,
            interests: updatedUser.interests,
            lifestyle: updatedUser.lifestyle,
            noise_level: updatedUser.noiseLevel,
            commute_distance: updatedUser.commuteDistance,
            rental_goal: updatedUser.rentalGoal
        };
        
        const { data, error } = await supabase.from('profiles').update(profileUpdate).eq('id', updatedUser.id).select().single();

        if (error) {
            console.error("Error updating profile:", error);
            alert(`Error al actualizar el perfil: ${error.message}`);
            return;
        }

        if (data) {
            const freshUser = mapProfileToUser(data);
            setCurrentUser(freshUser);
            setUsers(prev => prev.map(u => u.id === freshUser.id ? freshUser : u));
            alert("Perfil actualizado con éxito.");
        }
    };
    
    const renderView = () => {
        if (loading) {
            return (
                <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-white">
                    <MoonIcon className="w-16 h-16 animate-pulse" />
                    <p className="font-semibold">Cargando MoOn...</p>
                </div>
            );
        }

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
