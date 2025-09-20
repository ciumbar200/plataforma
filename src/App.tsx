import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import OwnerLandingPage from './pages/OwnerLandingPage';
import LoginPage from './pages/LoginPage';
import TenantDashboard from './dashboards/TenantDashboard';
import OwnerDashboard from './dashboards/OwnerDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import AccountLayout from './pages/account/AccountLayout';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import { User, UserRole, RentalGoal, Property, PropertyType, SavedSearch, BlogPost, Notification } from './types';
import { MOCK_SAVED_SEARCHES, MOCK_BLOG_POSTS, MOCK_NOTIFICATIONS, MOCK_MATCHES } from './constants';
import { supabase } from './lib/supabaseClient';
import { MoonIcon } from './components/icons';

type Page = 'home' | 'owners' | 'login' | 'tenant-dashboard' | 'owner-dashboard' | 'admin-dashboard' | 'account' | 'blog' | 'about' | 'privacy' | 'terms' | 'contact';

type RegistrationData = { rentalGoal: RentalGoal; city: string; locality: string };
type PublicationData = { property_type: PropertyType; city: string; locality: string };

function App() {
  const [page, setPage] = useState<Page>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<User[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(MOCK_SAVED_SEARCHES);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(MOCK_BLOG_POSTS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [matches, setMatches] = useState<{ [key: string]: string[] }>(MOCK_MATCHES);

  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [publicationData, setPublicationData] = useState<PublicationData | null>(null);
  const [accountInitialTab, setAccountInitialTab] = useState<string>('overview');
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: usersData, error: usersError } = await supabase.from('profiles').select('*');
        if (usersError) throw usersError;
        setUsers(usersData as User[]);
        
        const { data: propertiesData, error: propertiesError } = await supabase.from('properties').select('*');
        if (propertiesError) throw propertiesError;
        setProperties(propertiesData as Property[]);
        
      } catch (error: any) {
        console.error("Error al obtener datos de Supabase:", error.message || error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setRegistrationData(null);
    setPublicationData(null);
    if (user.role === UserRole.ADMIN) setPage('admin-dashboard');
    else if (user.role === UserRole.PROPIETARIO) setPage('owner-dashboard');
    else setPage('tenant-dashboard');
  };
  
  const handleRegister = async (userData: Partial<User>) => {
    let newUserPayload;
    let targetRole: UserRole;

    if (publicationData) { // Owner registration flow
        targetRole = UserRole.PROPIETARIO;
        newUserPayload = {
            name: userData.name,
            last_name: userData.last_name || '',
            email: userData.email,
            age: userData.age,
            city: publicationData.city,
            locality: publicationData.locality,
            profile_picture: `https://placehold.co/200x200/a78bfa/4c1d95?text=${userData.name?.charAt(0)}`,
            role: targetRole,
        };
    } else if (registrationData) { // Tenant registration flow
        targetRole = UserRole.INQUILINO;
        newUserPayload = {
            name: userData.name,
            last_name: userData.last_name || '',
            email: userData.email,
            age: userData.age,
            city: registrationData.city,
            locality: registrationData.locality,
            rental_goal: registrationData.rentalGoal,
            profile_picture: `https://placehold.co/200x200/93c5fd/1e3a8a?text=${userData.name?.charAt(0)}`,
            interests: [],
            lifestyle: [],
            noise_level: 'Medio' as const,
            role: targetRole,
        };
    } else {
        alert("Error: No se ha iniciado ningún flujo de registro.");
        return;
    }

    // NOTE: This flow bypasses Supabase Auth for demo purposes.
    // A real app would integrate with supabase.auth.signUp
    const { data, error } = await supabase
      .from('profiles')
      .insert(newUserPayload)
      .select();

    if (error) {
        console.error('Error en el registro:', error);
        alert(`Error al registrar el perfil: ${error.message}`);
    } else if (data) {
        const newUser = data[0] as User;
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);

        if (targetRole === UserRole.PROPIETARIO) {
            setPage('owner-dashboard');
            // publicationData remains set, OwnerDashboard will use it
        } else {
            setPage('tenant-dashboard');
            setRegistrationData(null); // Clear tenant registration data
        }
    }
  };


  const handleLogout = () => {
    setCurrentUser(null);
    setPage('home');
  };

  const handleStartRegistration = (data: RegistrationData) => {
    setRegistrationData(data);
    setPublicationData(null);
    setPage('login');
  };

  const handleStartPublication = (data: PublicationData) => {
    setPublicationData(data);
    setRegistrationData(null);
    setPage('login');
  };

  const handleUpdateUser = async (updatedUser: User) => {
    if (!currentUser) return;
    
    // @ts-ignore - 'compatibility' is a calculated field and should not be saved to the database.
    const { id, compatibility, ...updateData } = updatedUser;
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error al actualizar el usuario:', error);
      alert('Error al actualizar el perfil.');
    } else if (data) {
      const updated = data[0] as User;
      setCurrentUser(updated);
      setUsers(users.map(u => u.id === updated.id ? updated : u));
      alert('Perfil actualizado');
      setPage(currentUser.role === UserRole.INQUILINO ? 'tenant-dashboard' : 'owner-dashboard');
    }
  };

  const handleSaveProperty = async (propertyData: Omit<Property, 'id' | 'views' | 'compatible_candidates' | 'owner_id'> & { id?: number }) => {
    if (!currentUser) return;
    
    const dataToSave = {
      ...propertyData,
      price: Number(propertyData.price),
    };

    if (propertyData.id) { // Update
      const { id, ...updateData } = dataToSave;
      const { data, error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id)
        .select();
      if (error) {
          console.error('Error al actualizar la propiedad:', error);
      } else if (data) {
          setProperties(properties.map(p => p.id === data[0].id ? data[0] as Property : p));
      }
    } else { // Insert
      const newPropertyData = {
        ...dataToSave,
        owner_id: currentUser.id,
        views: 0,
        compatible_candidates: 0,
        status: 'pending' as const,
      };
      const { data, error } = await supabase
        .from('properties')
        .insert(newPropertyData)
        .select();
      if (error) {
        console.error('Error al crear la propiedad:', error);
      } else if (data) {
        setProperties(prev => [...prev, data[0] as Property]);
      }
    }
  };

  const handleAddMatch = (matchedUserId: string) => {
    if (!currentUser) return;
    const currentMatches = matches[currentUser.id] || [];
    if (!currentMatches.includes(matchedUserId)) {
        setMatches(prev => ({ ...prev, [currentUser.id]: [...currentMatches, matchedUserId] }));
    }
  };

  const handleUpdatePropertyStatus = async (propertyId: number, status: 'approved' | 'rejected') => {
    const { data, error } = await supabase
      .from('properties')
      .update({ status })
      .eq('id', propertyId)
      .select();

    if (error) {
      console.error('Error al actualizar el estado de la propiedad:', error);
    } else if (data) {
      setProperties(properties.map(p => p.id === propertyId ? data[0] as Property : p));
    }
  };
  
  const handleDeleteProperty = async (propertyId: number) => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (error) {
      console.error('Error al eliminar la propiedad:', error);
    } else {
      setProperties(properties.filter(p => p.id !== propertyId));
    }
  };

  const handleSetUserBanStatus = async (userId: string, isBanned: boolean) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_banned: isBanned })
      .eq('id', userId)
      .select();
    
    if (error) {
      console.error('Error al actualizar el estado de baneo del usuario:', error);
    } else if (data) {
      setUsers(users.map(u => u.id === userId ? data[0] as User : u));
    }
  };

  const handleSaveBlogPost = (postData: Omit<BlogPost, 'id'> & { id?: number }) => {
    if (postData.id) {
        setBlogPosts(blogPosts.map(p => p.id === postData.id ? { ...p, ...postData } as BlogPost : p));
    } else {
        const newPost: BlogPost = {
            ...postData,
            id: Math.max(0, ...blogPosts.map(p => p.id)) + 1,
            slug: postData.title.toLowerCase().replace(/\s+/g, '-'),
            author: currentUser?.name || 'Admin',
            author_image_url: currentUser?.profile_picture || '',
            publish_date: new Date().toISOString(),
        };
        setBlogPosts(prev => [newPost, ...prev]);
    }
  };

  const handleDeleteBlogPost = (postId: number) => {
    setBlogPosts(blogPosts.filter(p => p.id !== postId));
  };

  const pageNavigationProps = {
    onHomeClick: () => setPage('home'),
    onOwnersClick: () => setPage('owners'),
    onLoginClick: () => setPage('login'),
    onBlogClick: () => setPage('blog'),
    onAboutClick: () => setPage('about'),
    onPrivacyClick: () => setPage('privacy'),
    onTermsClick: () => setPage('terms'),
    onContactClick: () => setPage('contact'),
  };
  
  if (loading) {
    return (
        <div className="h-screen w-screen bg-gray-900 flex flex-col items-center justify-center text-white">
            <MoonIcon className="w-16 h-16 animate-pulse text-indigo-400" />
            <p className="mt-4 text-lg">Cargando MoOn...</p>
        </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage onStartRegistration={handleStartRegistration} {...pageNavigationProps} />;
      case 'owners': return <OwnerLandingPage onStartPublication={handleStartPublication} {...pageNavigationProps} />;
      case 'login': return <LoginPage onLogin={handleLogin} onRegister={handleRegister} users={users} registrationData={registrationData} publicationData={publicationData} {...pageNavigationProps} />;
      case 'blog': return <BlogPage posts={blogPosts} {...pageNavigationProps} />;
      case 'about': return <AboutPage {...pageNavigationProps} />;
      case 'privacy': return <PrivacyPolicyPage {...pageNavigationProps} />;
      case 'terms': return <TermsPage {...pageNavigationProps} />;
      case 'contact': return <ContactPage {...pageNavigationProps} />;
      case 'tenant-dashboard':
        if (!currentUser) return <LoginPage onLogin={handleLogin} onRegister={handleRegister} users={users} {...pageNavigationProps} />;
        return <TenantDashboard 
            user={currentUser} 
            allUsers={users}
            properties={properties.filter(p => p.status === 'approved')}
            onSendInterest={() => alert('Interés enviado (simulación)')}
            savedSearches={savedSearches}
            onSaveSearch={(search) => setSavedSearches([...savedSearches, {...search, id: Date.now(), user_id: currentUser.id}])}
            onDeleteSearch={(id) => setSavedSearches(savedSearches.filter(s => s.id !== id))}
            userMatches={matches[currentUser.id] || []}
            onAddMatch={handleAddMatch}
            onGoToAccountSettings={() => { setAccountInitialTab('profile'); setPage('account'); }}
        />;
      case 'owner-dashboard':
        if (!currentUser) return <LoginPage onLogin={handleLogin} onRegister={handleRegister} users={users} {...pageNavigationProps} />;
        return <OwnerDashboard 
            user={currentUser}
            properties={properties.filter(p => p.owner_id === currentUser.id)}
            onSaveProperty={handleSaveProperty}
            initialPropertyData={publicationData}
            onClearInitialPropertyData={() => setPublicationData(null)}
            allUsers={users}
            matches={matches}
        />;
      case 'admin-dashboard':
        if (!currentUser || currentUser.role !== UserRole.ADMIN) return <LoginPage onLogin={handleLogin} onRegister={handleRegister} users={users} {...pageNavigationProps} />;
        return <AdminDashboard 
            users={users}
            properties={properties}
            blogPosts={blogPosts}
            onUpdatePropertyStatus={handleUpdatePropertyStatus}
            onDeleteProperty={handleDeleteProperty}
            onSetUserBanStatus={handleSetUserBanStatus}
            onSaveBlogPost={handleSaveBlogPost}
            onDeleteBlogPost={handleDeleteBlogPost}
            onLogout={handleLogout}
        />;
      case 'account':
        if (!currentUser) return <LoginPage onLogin={handleLogin} onRegister={handleRegister} users={users} {...pageNavigationProps} />;
        const backPage = currentUser.role === UserRole.INQUILINO ? 'tenant-dashboard' : 'owner-dashboard';
        return <AccountLayout 
            user={currentUser}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
            onBack={() => setPage(backPage)}
            initialTab={accountInitialTab}
            {...pageNavigationProps}
        />
      default: return <HomePage onStartRegistration={handleStartRegistration} {...pageNavigationProps} />;
    }
  };

  return <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">{renderPage()}</div>;
}

export default App;
