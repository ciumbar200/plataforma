import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import OwnerLandingPage from './pages/OwnerLandingPage';
import LoginPage, { PostRegisterPage } from './pages/LoginPage';
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

type Page = 'home' | 'owners' | 'login' | 'tenant-dashboard' | 'owner-dashboard' | 'admin-dashboard' | 'account' | 'blog' | 'about' | 'privacy' | 'terms' | 'contact' | 'post-register';

type RegistrationData = { rentalGoal: RentalGoal; city: string; locality: string };
type PublicationData = { property_type: PropertyType; city: string; locality: string };

const PENDING_REG_DATA_KEY = 'pending_registration_data';

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
    setLoading(true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!session?.user) {
            setCurrentUser(null);
            setUsers([]);
            setProperties([]);
            setPage('home');
            setLoading(false);
            return;
        }

        const [profileRes, allUsersRes, propertiesRes] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', session.user.id).single(),
            supabase.from('profiles').select('*'),
            supabase.from('properties').select('*')
        ]);

        if (propertiesRes.data) setProperties(propertiesRes.data as Property[]);
        if (allUsersRes.data) setUsers(allUsersRes.data as User[]);
        if (propertiesRes.error) console.error("Error fetching properties:", propertiesRes.error.message);
        if (allUsersRes.error) console.error("Error fetching all users:", allUsersRes.error.message);

        if (profileRes.error && profileRes.error.code !== 'PGRST116') {
            console.error("Error fetching profile:", profileRes.error);
            await supabase.auth.signOut();
            setCurrentUser(null);
            setPage('home');
        } else if (profileRes.data) {
            const user = profileRes.data as User;
            setCurrentUser(user);
            if (user.role === UserRole.ADMIN) {
                setPage('admin-dashboard');
            } else if (user.role === UserRole.PROPIETARIO) {
                setPage('owner-dashboard');
            } else {
                setPage('tenant-dashboard');
            }
        } else {
            // Self-healing: Profile not found. Create it using stored data or fallbacks.
            let pendingData: Partial<User> | null = null;
            try {
                const stored = localStorage.getItem(PENDING_REG_DATA_KEY);
                if (stored) {
                    pendingData = JSON.parse(stored);
                    localStorage.removeItem(PENDING_REG_DATA_KEY);
                }
            } catch (e) { console.warn("Could not read pending registration data", e); }
            
            const userMetaData = session.user.user_metadata;
            const newProfile = {
                id: session.user.id,
                email: session.user.email,
                name: pendingData?.name || userMetaData.name || session.user.email?.split('@')[0] || 'Nuevo Usuario',
                age: pendingData?.age || userMetaData.age || 0,
                role: pendingData?.role || userMetaData.role || UserRole.INQUILINO,
                avatar_url: userMetaData.avatar_url || `https://placehold.co/200x200/9ca3af/1f2937?text=${(pendingData?.name || userMetaData.name || session.user.email || '?').charAt(0)}`,
                city: pendingData?.city || userMetaData.city,
                locality: pendingData?.locality || userMetaData.locality,
                rental_goal: pendingData?.rental_goal || userMetaData.rental_goal,
                interests: [],
                lifestyle: [],
                noise_level: 'Medio' as const,
                bio: '',
                is_profile_complete: false,
            };

            const { data: createdProfile, error: insertError } = await supabase
                .from('profiles')
                .insert(newProfile)
                .select()
                .single();

            if (insertError) {
                console.error("Failed to self-heal and create profile:", insertError.message);
                await supabase.auth.signOut();
                setCurrentUser(null);
                setPage('home');
            } else if (createdProfile) {
                console.log("Profile created successfully via self-healing.");
                const user = createdProfile as User;
                setCurrentUser(user);
                setUsers(prevUsers => [...prevUsers, user]);
                // Redirection is handled by the main component logic based on is_profile_complete
            }
        }
        
        setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (user: User) => {
    localStorage.removeItem(PENDING_REG_DATA_KEY);
    setUsers(prev => prev.find(u => u.id === user.id) ? prev : [...prev, user]);
    setCurrentUser(user);
    setRegistrationData(null);
    setPublicationData(null);
    if (user.role === UserRole.ADMIN) setPage('admin-dashboard');
    else if (user.is_profile_complete === false) {
        // Handled by main render logic
    }
    else if (user.role === UserRole.PROPIETARIO) setPage('owner-dashboard');
    else setPage('tenant-dashboard');
  };
  
  const handleRegister = async (userData: Partial<User>, password?: string, role?: UserRole) => {
    if (!password || !userData.email) {
      throw new Error("Email y contraseña son requeridos para el registro.");
    }
    
    const roleToRegister = role || (publicationData ? UserRole.PROPIETARIO : UserRole.INQUILINO);
    const dataForStorage = {
        name: userData.name,
        age: userData.age,
        role: roleToRegister,
        city: publicationData?.city || registrationData?.city,
        locality: publicationData?.locality || registrationData?.locality,
        rental_goal: registrationData?.rentalGoal,
    };
    
    // Store data in localStorage as a fallback for self-healing
    localStorage.setItem(PENDING_REG_DATA_KEY, JSON.stringify(dataForStorage));

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: password,
      options: {
        data: {
          ...dataForStorage,
          avatar_url: `https://placehold.co/200x200/9ca3af/1f2937?text=${(userData.name || '?').charAt(0)}`,
        }
      }
    });

    if (authError) {
      localStorage.removeItem(PENDING_REG_DATA_KEY);
      console.error('Error en el registro de Auth:', authError.message);
      throw authError;
    }

    if (!authData.user) {
      localStorage.removeItem(PENDING_REG_DATA_KEY);
      throw new Error('Registro completado, pero no se pudo obtener la información del usuario. Por favor, verifica tu email e intenta iniciar sesión.');
    }
    
    setRegistrationData(null);
    setPublicationData(null);
    setPage('post-register');
  };


  const handleLogout = async () => {
    localStorage.removeItem(PENDING_REG_DATA_KEY);
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
  
  const handleGoToAccountSettings = () => {
    setAccountInitialTab('profile');
    setPage('account');
  };

  const handleUpdateUser = (updatedUser: User): boolean => {
    if (!currentUser) return false;

    const shouldMarkProfileComplete = !currentUser.is_profile_complete && updatedUser.bio && updatedUser.bio.length >= 100;

    const performUpdate = async () => {
        try {
            const { id, ...dataFromForm } = updatedUser;
            
            const metadataToUpdate: { [key: string]: any } = {};
            if (dataFromForm.name && dataFromForm.name !== currentUser.name) metadataToUpdate.name = dataFromForm.name;
            if (dataFromForm.avatar_url && dataFromForm.avatar_url !== currentUser.avatar_url) metadataToUpdate.avatar_url = dataFromForm.avatar_url;
            
            if (Object.keys(metadataToUpdate).length > 0) {
                const { error: authError } = await supabase.auth.updateUser({ data: metadataToUpdate });
                if (authError) throw new Error(`Error al actualizar metadatos: ${authError.message}`);
            }
            
            const profileDataToUpdate = {
                ...dataFromForm,
                is_profile_complete: shouldMarkProfileComplete ? true : currentUser.is_profile_complete,
            };

            const { data: finalProfile, error: profileError } = await supabase.from('profiles').update(profileDataToUpdate).eq('id', id).select().single();

            if (profileError) throw new Error(`Error de base de datos: ${profileError.message}`);
            if (!finalProfile) throw new Error("La base de datos no devolvió el perfil actualizado.");
            
            const finalUser: User = { ...currentUser, ...finalProfile };
            setCurrentUser(finalUser);
            setUsers(prev => prev.map(u => (u.id === finalUser.id ? finalUser : u)));

            if (shouldMarkProfileComplete && finalUser.role === UserRole.INQUILINO) {
                supabase.functions.invoke('sync-tenant-to-fluentcrm', { body: finalUser })
                    .then(({ error }) => { if (error) console.error("Error en la sincronización con CRM:", error.message) });
            }
        } catch (error: any) {
            console.error("Fallo al guardar perfil en segundo plano:", error);
            // Optionally, implement a global notification to inform the user of the failure.
            // For now, we revert the optimistic update.
            setCurrentUser(currentUser);
            if(shouldMarkProfileComplete) setPage('account');
        }
    };
    
    // Perform async operations in the background.
    performUpdate();

    // Optimistic UI update for immediate redirection.
    if (shouldMarkProfileComplete) {
        const optimisticUser = { ...currentUser, ...updatedUser, is_profile_complete: true };
        setCurrentUser(optimisticUser);
        if (optimisticUser.role === UserRole.INQUILINO) {
            setPage('tenant-dashboard');
        }
    }
    
    return shouldMarkProfileComplete;
  };

  const handleSaveProperty = async (propertyData: Omit<Property, 'id' | 'views' | 'compatible_candidates' | 'owner_id' | 'image_urls'> & { id?: number; imageFiles: File[]; image_urls: string[] }) => {
    if (!currentUser) return;
    
    try {
        let uploadedImageUrls: string[] = [];
        if (propertyData.imageFiles && propertyData.imageFiles.length > 0) {
            const uploadPromises = propertyData.imageFiles.map(async (file) => {
                const fileExt = file.name.split('.').pop();
                const filePath = `${currentUser.id}/${Date.now()}-${file.name}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('property-media')
                    .upload(filePath, file);

                if (uploadError) {
                    throw new Error(`Error al subir la imagen: ${uploadError.message}`);
                }

                const { data: urlData } = supabase.storage
                    .from('property-media')
                    .getPublicUrl(filePath);
                
                return urlData.publicUrl;
            });
            uploadedImageUrls = await Promise.all(uploadPromises);
        }

        const finalImageUrls = [...(propertyData.image_urls || []), ...uploadedImageUrls];

        const { imageFiles, ...dbData } = propertyData;
        const dataToSave = {
          ...dbData,
          image_urls: finalImageUrls,
          price: Number(propertyData.price),
        };

        if (propertyData.id) { // Update
            const { id, ...updateData } = dataToSave;
            const { data, error } = await supabase
                .from('properties')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            if (data) setProperties(prev => prev.map(p => p.id === data.id ? data as Property : p));

        } else { // Insert
            const newPropertyData = {
                ...dataToSave,
                owner_id: currentUser.id,
                views: 0,
                compatible_candidates: 0,
                status: 'approved' as const,
            };
            const { data, error } = await supabase
                .from('properties')
                .insert(newPropertyData)
                .select()
                .single();

            if (error) throw error;
            if (data) {
                setProperties(prev => [...prev, data as Property]);
                if (!currentUser.is_profile_complete) {
                    const { data: updatedProfile, error: profileError } = await supabase
                        .from('profiles')
                        .update({ is_profile_complete: true })
                        .eq('id', currentUser.id)
                        .select()
                        .single();

                    if (profileError) throw profileError;
                    if (updatedProfile) {
                        const fullyUpdatedUser = { ...currentUser, ...updatedProfile };
                        setCurrentUser(fullyUpdatedUser);
                        setUsers(prev => prev.map(u => u.id === fullyUpdatedUser.id ? fullyUpdatedUser : u));
                        if (fullyUpdatedUser.role === UserRole.PROPIETARIO) {
                            setPage('owner-dashboard');
                        }
                    }
                }
            }
        }
    } catch (error: any) {
        console.error("Error al guardar la propiedad:", error.message);
        alert(`Error al guardar la propiedad: ${error.message}. Asegúrate de que el bucket 'property-media' existe y es público.`);
    }
  };

  const handleAddMatch = (matchedUserId: string) => {
    if (!currentUser) return;
    setMatches(prev => {
        const currentMatches = prev[currentUser.id] || [];
        if (!currentMatches.includes(matchedUserId)) {
            return { ...prev, [currentUser.id]: [...currentMatches, matchedUserId] };
        }
        return prev;
    });
  };
  
  const handleDeleteProperty = async (propertyId: number) => {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (error) {
      console.error('Error al eliminar la propiedad:', error);
    } else {
      setProperties(prev => prev.filter(p => p.id !== propertyId));
    }
  };

  const handleSetUserBanStatus = async (userId: string, isBanned: boolean) => {
    const originalUsers = [...users];
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, is_banned: isBanned } : u)));

    const { error } = await supabase.from('profiles').update({ is_banned: isBanned }).eq('id', userId);
    if (error) {
      console.error('Error al actualizar el estado de baneo del usuario:', error.message);
      setUsers(originalUsers); // Revert on error
    }
  };

  const handleSaveBlogPost = (postData: Omit<BlogPost, 'id'> & { id?: number }) => {
    setBlogPosts(prev => {
        if (postData.id) {
            return prev.map(p => p.id === postData.id ? { ...p, ...postData } as BlogPost : p);
        } else {
            const newPost: BlogPost = {
                ...postData,
                id: Math.max(0, ...prev.map(p => p.id)) + 1,
                slug: postData.title.toLowerCase().replace(/\s+/g, '-'),
                author: currentUser?.name || 'Admin',
                author_image_url: currentUser?.avatar_url || '',
                publish_date: new Date().toISOString(),
            };
            return [newPost, ...prev];
        }
    });
  };

  const handleDeleteBlogPost = (postId: number) => {
    setBlogPosts(prev => prev.filter(p => p.id !== postId));
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

  // Mandatory Profile/Property completion flow
  if (currentUser && !currentUser.is_profile_complete) {
    if (currentUser.role === UserRole.INQUILINO) {
        return <AccountLayout 
            user={currentUser}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
            onBack={() => {}} // No-op, should not be visible
            isMandatory={true}
            initialTab="profile"
            {...pageNavigationProps}
        />;
    }
    if (currentUser.role === UserRole.PROPIETARIO) {
        return <OwnerDashboard 
            user={currentUser}
            properties={properties.filter(p => p.owner_id === currentUser.id)}
            onSaveProperty={handleSaveProperty}
            forceAddProperty={true}
            initialPropertyData={publicationData}
            onClearInitialPropertyData={() => setPublicationData(null)}
            allUsers={users}
            matches={matches}
            onLogout={handleLogout}
            onGoToAccountSettings={handleGoToAccountSettings}
            onUpdateUser={() => Promise.resolve()} // This handler is for tenants; owners complete profile via property
        />;
    }
  }

  const renderPage = () => {
    const loginPageProps = { ...pageNavigationProps, onRegisterClick: () => { setLoginInitialMode('register'); setPage('login'); } };
    
    switch (page) {
      case 'home': return <HomePage onStartRegistration={handleStartRegistration} {...pageNavigationProps} onRegisterClick={loginPageProps.onRegisterClick} />;
      case 'owners': return <OwnerLandingPage onStartPublication={handleStartPublication} onLoginClick={handleGoToLogin} onHomeClick={() => setPage('home')} {...pageNavigationProps} />;
      case 'login': return <LoginPage onLogin={handleLogin} onRegister={handleRegister} registrationData={registrationData} publicationData={publicationData} initialMode={loginInitialMode} {...loginPageProps} />;
      case 'post-register': return <PostRegisterPage onGoToLogin={handleGoToLogin} />;
      case 'blog': return <BlogPage posts={blogPosts} {...loginPageProps} />;
      case 'about': return <AboutPage {...loginPageProps} />;
      case 'privacy': return <PrivacyPolicyPage {...loginPageProps} />;
      case 'terms': return <TermsPage {...loginPageProps} />;
      case 'contact': return <ContactPage {...loginPageProps} />;
      case 'tenant-dashboard':
        if (!currentUser) return <LoginPage onLogin={handleLogin} onRegister={handleRegister} initialMode="login" {...loginPageProps} />;
        return <TenantDashboard 
            user={currentUser} 
            allUsers={users}
            properties={properties.filter(p => p.status === 'approved')}
            onSendInterest={() => alert('Interés enviado (simulación)')}
            savedSearches={savedSearches}
            onSaveSearch={(search) => setSavedSearches(prev => [...prev, {...search, id: Date.now(), user_id: currentUser.id}])}
            onDeleteSearch={(id) => setSavedSearches(prev => prev.filter(s => s.id !== id))}
            userMatches={matches[currentUser.id] || []}
            onAddMatch={handleAddMatch}
            onGoToAccountSettings={handleGoToAccountSettings}
            onLogout={handleLogout}
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
            onLogout={handleLogout}
            onGoToAccountSettings={handleGoToAccountSettings}
            onUpdateUser={() => Promise.resolve()}
        />;
      case 'admin-dashboard':
        if (!currentUser || currentUser.role !== UserRole.ADMIN) return <LoginPage onLogin={handleLogin} onRegister={handleRegister} initialMode="login" {...loginPageProps} />;
        return <AdminDashboard 
            users={users}
            properties={properties}
            blogPosts={blogPosts}
            matches={matches}
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
      default: return <HomePage onStartRegistration={handleStartRegistration} {...pageNavigationProps} onRegisterClick={loginPageProps.onRegisterClick} />;
    }
  };

  return <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">{renderPage()}</div>;
}

export default App;
