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
  const [loginInitialMode, setLoginInitialMode] = useState<'login' | 'register'>('login');

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
    const initializeApp = async () => {
      try {
        const [{ data: { session } }, usersRes, propertiesRes] = await Promise.all([
          supabase.auth.getSession(),
          supabase.from('profiles').select('*'),
          supabase.from('properties').select('*')
        ]);

        if (usersRes.error) throw usersRes.error;
        if (propertiesRes.error) throw propertiesRes.error;

        const allUsers = usersRes.data as User[];
        setUsers(allUsers);
        setProperties(propertiesRes.data as Property[]);

        if (session?.user) {
          const profile = allUsers.find(u => u.id === session.user.id);
          
          if (profile) {
            // Sync avatar_url from auth metadata to profile state on load
            const avatar_url = session.user.user_metadata?.avatar_url || profile.avatar_url;
            const syncedProfile = { ...profile, avatar_url };

            setCurrentUser(syncedProfile);
            if (syncedProfile.role === UserRole.ADMIN) setPage('admin-dashboard');
            else if (syncedProfile.role === UserRole.PROPIETARIO) setPage('owner-dashboard');
            else setPage('tenant-dashboard');
          } else {
            await supabase.auth.signOut();
            setCurrentUser(null);
            setPage('home');
          }
        } else {
          setCurrentUser(null);
          setPage('home');
        }
      } catch (error: any) {
        console.error("Error al inicializar la aplicación:", error.message || error);
        setCurrentUser(null);
        setPage('home');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const userInState = users.find(u => u.id === session?.user?.id);
        
        if (session?.user && userInState) {
          if (currentUser?.id !== userInState.id) {
            const avatar_url = session.user.user_metadata?.avatar_url || userInState.avatar_url;
            const syncedProfile = { ...userInState, avatar_url };
            setCurrentUser(syncedProfile);

            if (syncedProfile.role === UserRole.ADMIN) setPage('admin-dashboard');
            else if (syncedProfile.role === UserRole.PROPIETARIO) setPage('owner-dashboard');
            else setPage('tenant-dashboard');
          }
        } else if (!session?.user && currentUser !== null) {
             setCurrentUser(null);
             setPage('home');
        }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setRegistrationData(null);
    setPublicationData(null);
    if (user.role === UserRole.ADMIN) setPage('admin-dashboard');
    else if (user.role === UserRole.PROPIETARIO) setPage('owner-dashboard');
    else setPage('tenant-dashboard');
  };
  
  const handleRegister = async (userData: Partial<User>, password?: string, role?: UserRole) => {
    if (!password || !userData.email) {
      alert("Email y contraseña son requeridos para el registro.");
      return;
    }
    let profileDataPayload: any;
    let targetRole: UserRole;

    if (publicationData) {
      targetRole = UserRole.PROPIETARIO;
      profileDataPayload = {
        name: userData.name || '', age: userData.age || 18, city: publicationData.city, locality: publicationData.locality, role: targetRole,
        avatar_url: `https://placehold.co/200x200/a78bfa/4c1d95?text=${(userData.name || 'P').charAt(0)}`, interests: [], noise_level: 'Medio',
      };
    } else if (registrationData) {
      targetRole = UserRole.INQUILINO;
      profileDataPayload = {
        name: userData.name || '', age: userData.age || 18, city: registrationData.city, locality: registrationData.locality, rental_goal: registrationData.rentalGoal, role: targetRole,
        avatar_url: `https://placehold.co/200x200/93c5fd/1e3a8a?text=${(userData.name || 'I').charAt(0)}`, interests: [], lifestyle: [], noise_level: 'Medio',
      };
    } else if (role) {
      targetRole = role;
      profileDataPayload = {
        name: userData.name || '', age: userData.age || 18, role: targetRole,
        avatar_url: `https://placehold.co/200x200/9ca3af/1f2937?text=${(userData.name || '?').charAt(0)}`, interests: [], noise_level: 'Medio',
      };
    } else {
      alert("Error: No se ha podido determinar el rol del usuario durante el registro.");
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email, password: password, options: { data: profileDataPayload },
    });

    if (authError) {
      console.error('Error en el registro de Auth:', authError);
      alert(`Error al registrar: ${authError.message}`);
      return;
    }

    if (authData.user) {
      alert('¡Registro exitoso! Por favor, revisa tu correo electrónico para verificar tu cuenta.');
      setRegistrationData(null);
      setPublicationData(null);
      setPage('login');
      setLoginInitialMode('login');
    }
  };


  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error al cerrar sesión:", error.message);
        alert(`Error al cerrar sesión: ${error.message}`);
    } else {
        setCurrentUser(null);
        setPage('home');
    }
  };

  const handleStartRegistration = (data: RegistrationData) => {
    setRegistrationData(data);
    setPublicationData(null);
    setLoginInitialMode('register');
    setPage('login');
  };

  const handleStartPublication = (data: PublicationData) => {
    setPublicationData(data);
    setRegistrationData(null);
    setLoginInitialMode('register');
    setPage('login');
  };
  
  const handleGoToLogin = () => {
    setRegistrationData(null);
    setPublicationData(null);
    setLoginInitialMode('login');
    setPage('login');
  };

const handleUpdateUser = async (updatedUser: User) => {
    if (!currentUser) {
        throw new Error("No hay un usuario autenticado para actualizar.");
    }

    try {
        const { id, ...dataFromForm } = updatedUser;
        const { avatar_url } = dataFromForm;

        // 1. Update auth user metadata if avatar has changed.
        if (avatar_url && avatar_url !== currentUser.avatar_url) {
            const { error: authError } = await supabase.auth.updateUser({
                data: { avatar_url: avatar_url }
            });
            if (authError) {
                throw new Error(`Error al actualizar metadatos de autenticación: ${authError.message}`);
            }
        }
        
        // 2. Prepare payload for the 'profiles' table, EXCLUDING avatar_url.
        // The error indicates the 'avatar_url' column does not exist in the profiles table.
        const profileDataToUpdate = {
            name: dataFromForm.name,
            age: dataFromForm.age,
            bio: dataFromForm.bio,
            city: dataFromForm.city,
            locality: dataFromForm.locality,
            video_url: dataFromForm.video_url,
            interests: dataFromForm.interests,
            lifestyle: dataFromForm.lifestyle,
            noise_level: dataFromForm.noise_level,
            commute_distance: dataFromForm.commute_distance,
        };

        const { data: updatedProfile, error: profileError } = await supabase
            .from('profiles')
            .update(profileDataToUpdate)
            .eq('id', id)
            .select()
            .single();

        if (profileError) {
            throw new Error(`Error de base de datos al actualizar el perfil: ${profileError.message}`);
        }

        if (!updatedProfile) {
            throw new Error("La base de datos no devolvió el perfil actualizado.");
        }
        
        // 3. Construct final user state with the new avatar_url from the form/upload.
        const finalUser: User = { 
            ...currentUser, 
            ...updatedProfile,
            avatar_url: dataFromForm.avatar_url, // Use the potentially new avatar URL
        };

        setCurrentUser(finalUser);
        setUsers(currentUsers => currentUsers.map(u => (u.id === finalUser.id ? finalUser : u)));

    } catch (error: any) {
        console.error("Error detallado al actualizar el perfil:", error);
        throw error;
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
            author_image_url: currentUser?.avatar_url || '',
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
    onLoginClick: handleGoToLogin,
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
    const loginPageProps = { ...pageNavigationProps, onRegisterClick: () => { setLoginInitialMode('register'); setPage('login'); } };
    
    switch (page) {
      case 'home': return <HomePage onStartRegistration={handleStartRegistration} {...pageNavigationProps} />;
      case 'owners': return <OwnerLandingPage onStartPublication={handleStartPublication} {...pageNavigationProps} />;
      case 'login': return <LoginPage onLogin={handleLogin} onRegister={handleRegister} registrationData={registrationData} publicationData={publicationData} initialMode={loginInitialMode} {...loginPageProps} />;
      case 'blog': return <BlogPage posts={blogPosts} {...pageNavigationProps} />;
      case 'about': return <AboutPage {...pageNavigationProps} />;
      case 'privacy': return <PrivacyPolicyPage {...pageNavigationProps} />;
      case 'terms': return <TermsPage {...pageNavigationProps} />;
      case 'contact': return <ContactPage {...pageNavigationProps} />;
      case 'tenant-dashboard':
        if (!currentUser) return <LoginPage onLogin={handleLogin} onRegister={handleRegister} initialMode="login" {...loginPageProps} />;
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
        if (!currentUser) return <LoginPage onLogin={handleLogin} onRegister={handleRegister} initialMode="login" {...loginPageProps}/>;
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
        if (!currentUser || currentUser.role !== UserRole.ADMIN) return <LoginPage onLogin={handleLogin} onRegister={handleRegister} initialMode="login" {...loginPageProps} />;
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
        if (!currentUser) return <LoginPage onLogin={handleLogin} onRegister={handleRegister} initialMode="login" {...loginPageProps} />;
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