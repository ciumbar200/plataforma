import React, { useState, useEffect, useCallback } from 'react';
import { supabase, getUserProfile } from './lib/supabaseClient';

// --- TYPES ---
import { User, UserRole, Property, Notification, SavedSearch, RentalGoal, PropertyType, BlogPost } from './types';

// --- CONSTANTS ---
import { showNotification, sendEmail, addToFluentCRM } from './constants';

// --- PAGES ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OwnerLandingPage from './pages/OwnerLandingPage';
import AccountLayout from './pages/account/AccountLayout';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';

// --- DASHBOARDS ---
import AdminDashboard from './dashboards/AdminDashboard';
import OwnerDashboard from './dashboards/OwnerDashboard';
import TenantDashboard from './dashboards/TenantDashboard';

// --- COMPONENTS ---
import { BellIcon, MoonIcon } from './components/icons';
import ProfileDropdown from './dashboards/components/ProfileDropdown';
import NotificationsPopover from './dashboards/components/NotificationsPopover';

const App: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [view, setView] = useState<'home' | 'login' | 'owner-landing' | 'dashboard' | 'account-settings' | 'blog' | 'about' | 'privacy' | 'terms' | 'contact'>('home');
    
    const [users, setUsers] = useState<User[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
    const [userMatches, setUserMatches] = useState<string[]>([]);
    
    // --- APP-WIDE STATE ---
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any | null>(null);
    
    // --- LOGIN/REGISTRATION FLOW STATE ---
    const [initialLoginData, setInitialLoginData] = useState<Partial<User> & { propertyType?: PropertyType } | null>(null);
    const [registrationRole, setRegistrationRole] = useState<UserRole.INQUILINO | UserRole.PROPIETARIO>(UserRole.INQUILINO);
    const [accountSettingsTab, setAccountSettingsTab] = useState('overview');
    
    // --- UI STATE ---
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    
    // --- DATA FETCHING ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [usersRes, propertiesRes, blogPostsRes] = await Promise.all([
                supabase.from('profiles').select('*'),
                supabase.from('properties').select('*'),
                supabase.from('blog_posts').select('*').order('publish_date', { ascending: false }),
            ]);

            if (usersRes.error) throw usersRes.error;
            if (propertiesRes.error) throw propertiesRes.error;
            if (blogPostsRes.error) throw blogPostsRes.error;

            setUsers(usersRes.data as User[]);
            setProperties(propertiesRes.data as Property[]);
            setBlogPosts(blogPostsRes.data as BlogPost[]);

        } catch (error: any) {
            console.error("Error fetching initial data:", error.message);
            // Here you could set an error state to show a message to the user
        } finally {
            setLoading(false);
        }
    }, []);


    // --- AUTH & SESSION MANAGEMENT ---
    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await (supabase.auth as any).getSession();
            setSession(session);
            if (session?.user) {
                const profile = await getUserProfile(session.user.id);
                setCurrentUser(profile);
                if (profile && !profile.isBanned) {
                    setView('dashboard');
                }
            }
            setLoading(false);
        };
        
        getSession();

        const { data: { subscription } } = (supabase.auth as any).onAuthStateChange(
            async (_event: any, session: any | null) => {
                setSession(session);
                if (session?.user) {
                    const profile = await getUserProfile(session.user.id);
                    setCurrentUser(profile);
                    if (profile?.isBanned) {
                        alert('Esta cuenta ha sido baneada.');
                        await (supabase.auth as any).signOut();
                    } else if (profile) {
                         // Only fetch all data again if the user has changed
                        if (currentUser?.id !== profile.id) {
                            fetchData();
                        }
                        setView('dashboard');
                    }
                } else {
                    setCurrentUser(null);
                    setView('home');
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [fetchData, currentUser?.id]);
    
    useEffect(() => {
        // Initial data fetch when the app loads
        fetchData();
    }, [fetchData]);

    // --- HANDLERS ---
    const handleLogout = async () => {
        setLoading(true);
        await (supabase.auth as any).signOut();
        setCurrentUser(null);
        setView('home');
        setLoading(false);
    };

    const handleBackToHome = () => setView('home');
    const handleLoginClick = () => {
        setRegistrationRole(UserRole.INQUILINO);
        setInitialLoginData(null);
        setView('login');
    };
    const handleOwnersClick = () => setView('owner-landing');
    const handleBlogClick = () => setView('blog');
    const handleAboutClick = () => setView('about');
    const handlePrivacyClick = () => setView('privacy');
    const handleTermsClick = () => setView('terms');
    const handleContactClick = () => setView('contact');

    const handleStartRegistration = (data: { rentalGoal: RentalGoal; city: string; locality: string; }) => {
        setRegistrationRole(UserRole.INQUILINO);
        setInitialLoginData(data);
        setView('login');
    };
    
    const handleStartOwnerPublication = (data: { propertyType: PropertyType; city: string; locality: string; }) => {
        setRegistrationRole(UserRole.PROPIETARIO);
        setInitialLoginData(data);
        setView('login');
    }
    
    const handleUpdateUser = async (updatedUser: User) => {
        if (!currentUser) return;
        
        const { id, ...updateData } = updatedUser; // Supabase requires 'id' not to be in the update payload

        const { data, error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error updating user:", error);
            alert("Error al actualizar el perfil.");
        } else {
            setCurrentUser(data as User);
            setUsers(prev => prev.map(u => u.id === id ? (data as User) : u));
            showNotification('Perfil Actualizado', { body: 'Tus cambios se han guardado correctamente.' });
            setView('dashboard');
        }
    };

    const handleSaveProperty = async (propertyData: Omit<Property, 'id' | 'views' | 'compatibleCandidates' | 'owner_id'> & { id?: number }) => {
        if (!currentUser) return;
        setLoading(true);
        
        try {
            const { id, ...dataToSave } = propertyData;
            const payload = { ...dataToSave, owner_id: currentUser.id };
            
            if (id) { // Update existing property
                const { data, error } = await supabase.from('properties').update(payload).eq('id', id).select().single();
                if (error) throw error;
                setProperties(prev => prev.map(p => p.id === id ? (data as Property) : p));
            } else { // Create new property
                const { data, error } = await supabase.from('properties').insert(payload).select().single();
                if (error) throw error;
                setProperties(prev => [...prev, data as Property]);
                
                sendEmail(
                    'hello@moonsharedliving.com', // Replace with your admin email
                    `🔔 Propiedad Pendiente de Aprobación: ${data.title}`,
                    `<p>Una nueva propiedad ha sido enviada y está pendiente de aprobación.</p><ul><li><strong>Título:</strong> ${data.title}</li><li><strong>Propietario:</strong> ${currentUser?.name}</li></ul>`
                );
            }
        } catch (error: any) {
            console.error("Error saving property:", error.message);
            alert("Error al guardar la propiedad.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleGoToAccountSettings = (tab = 'overview') => {
        setAccountSettingsTab(tab);
        setView('account-settings');
    };
    
    const handleAddMatch = (matchedUserId: string) => {
        if (!userMatches.includes(matchedUserId)) {
            setUserMatches(prev => [...prev, matchedUserId]);
        }
    };

    // --- ADMIN HANDLERS (Example) ---
    const handleUpdatePropertyStatus = async (propertyId: number, status: 'approved' | 'rejected') => {
        const { data, error } = await supabase.from('properties').update({ status }).eq('id', propertyId).select().single();
        if (error) console.error(error);
        else setProperties(prev => prev.map(p => p.id === propertyId ? data as Property : p));
    };
    
    // ... other handlers (delete property, ban user, etc.) would be similar async functions ...
    
    // --- LOADING SCREEN ---
    if (loading) {
        return (
            <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 flex flex-col justify-center items-center text-white gap-4">
                <MoonIcon className="w-16 h-16 animate-pulse" />
                <p className="text-xl font-semibold">Cargando MoOn...</p>
            </div>
        );
    }

    // --- RENDER LOGIC ---
    
    const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        if (!currentUser) return null;
        
        const userNotifications = notifications.filter(n => n.userId === currentUser.id);
        const unreadCount = userNotifications.filter(n => !n.read).length;

        if (currentUser.role === UserRole.ADMIN) {
            return (
                <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white flex flex-col">
                    {children}
                </div>
            );
        }

        return (
             <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white flex flex-col">
                <header className="sticky top-0 z-40 bg-black/30 backdrop-blur-xl border-b border-white/20 text-white w-full">
                    <div className="max-w-screen-2xl mx-auto px-6 h-16 flex justify-between items-center">
                         <div className="flex items-center gap-2">
                            <MoonIcon className="w-8 h-8 text-white" />
                            <span className="text-xl font-bold">MoOn</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <button onClick={() => setIsNotificationsOpen(prev => !prev)} className="relative text-white/80 hover:text-white transition-colors p-2">
                                    <BellIcon className="w-6 h-6" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 block w-3 h-3 bg-red-500 rounded-full border-2 border-gray-800"></span>
                                    )}
                                </button>
                                {isNotificationsOpen && (
                                    <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 z-50">
                                        <NotificationsPopover
                                            notifications={userNotifications}
                                            onClose={() => setIsNotificationsOpen(false)}
                                            onMarkAsRead={() => {}}
                                            onMarkAllAsRead={() => {}}
                                        />
                                    </div>
                                )}
                            </div>
                            <ProfileDropdown user={currentUser} onLogout={handleLogout} onAccountSettings={() => handleGoToAccountSettings('overview')} />
                        </div>
                    </div>
                </header>
                {children}
            </div>
        );
    };

    const renderDashboard = () => {
        if (!currentUser) return <LoginPage onBack={handleBackToHome} registrationRole={registrationRole} />;
        
        const dashboardContent = () => {
            switch (currentUser.role) {
                case UserRole.ADMIN:
                    return <AdminDashboard 
                        users={users} 
                        properties={properties}
                        blogPosts={blogPosts}
                        onUpdatePropertyStatus={handleUpdatePropertyStatus}
                        onDeleteProperty={async (id) => { await supabase.from('properties').delete().eq('id', id); fetchData(); }}
                        onSetUserBanStatus={async (id, status) => { await supabase.from('profiles').update({ is_banned: status }).eq('id', id); fetchData(); }}
                        onSaveBlogPost={async (post) => { /* Implement save logic */ }}
                        onDeleteBlogPost={async (id) => { await supabase.from('blog_posts').delete().eq('id', id); fetchData(); }}
                        onLogout={handleLogout}
                    />;
                case UserRole.PROPIETARIO:
                    return <OwnerDashboard 
                        user={currentUser}
                        properties={properties.filter(p => p.owner_id === currentUser.id)}
                        onSaveProperty={handleSaveProperty}
                        initialPropertyData={initialLoginData as any}
                        onClearInitialPropertyData={() => setInitialLoginData(null)}
                    />;
                case UserRole.INQUILINO:
                default:
                    return <TenantDashboard 
                        user={currentUser}
                        allUsers={users}
                        properties={properties.filter(p => p.status === 'approved')}
                        onSendInterest={() => {}}
                        savedSearches={savedSearches}
                        onSaveSearch={() => {}}
                        onDeleteSearch={() => {}}
                        userMatches={userMatches}
                        onAddMatch={handleAddMatch}
                        onGoToAccountSettings={() => handleGoToAccountSettings('profile')}
                    />;
            }
        };

        return <DashboardLayout>{dashboardContent()}</DashboardLayout>;
    };
    
    const pageHandlers = {
        onLoginClick: handleLoginClick,
        onHomeClick: handleBackToHome,
        onBlogClick: handleBlogClick,
        onAboutClick: handleAboutClick,
        onPrivacyClick: handlePrivacyClick,
        onTermsClick: handleTermsClick,
        onContactClick: handleContactClick,
    };

    const renderContent = () => {
        if (currentUser && view !== 'dashboard' && view !== 'account-settings') {
             return renderDashboard();
        }

        switch (view) {
            case 'home':
                return <HomePage onStartRegistration={handleStartRegistration} onOwnersClick={handleOwnersClick} {...pageHandlers} />;
            case 'owner-landing':
                return <OwnerLandingPage onStartPublication={handleStartOwnerPublication} {...pageHandlers} />;
            case 'login':
                return <LoginPage onBack={handleBackToHome} initialData={initialLoginData} registrationRole={registrationRole} />;
            case 'blog':
                return <BlogPage posts={blogPosts} {...pageHandlers} />;
            case 'about':
                return <AboutPage {...pageHandlers} />;
            case 'privacy':
                return <PrivacyPolicyPage {...pageHandlers} />;
            case 'terms':
                return <TermsPage {...pageHandlers} />;
            case 'contact':
                return <ContactPage {...pageHandlers} />;
            case 'dashboard':
                return renderDashboard();
            case 'account-settings':
                if (!currentUser) {
                  setView('login');
                  return null;
                }
                return <AccountLayout user={currentUser} onUpdateUser={handleUpdateUser} onLogout={handleLogout} onBack={() => setView('dashboard')} initialTab={accountSettingsTab} {...pageHandlers} />;
            default:
                return <HomePage onStartRegistration={handleStartRegistration} onOwnersClick={handleOwnersClick} {...pageHandlers} />;
        }
    };

    return <div className="h-screen w-screen font-sans bg-gray-900">{renderContent()}</div>;
};

export default App;