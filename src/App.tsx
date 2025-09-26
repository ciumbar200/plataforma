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

            handleLogin(syncedProfile);
          } else {
            console.warn("User session exists but no profile found. Logging out.");
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (_event === 'SIGNED_IN' && session?.user) {
             const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profileData) {
                if (currentUser?.id !== profileData.id) {
                    handleLogin(profileData as User);
                }
            } else if (session.user.app_metadata.provider === 'google') {
                // This is a new user from OAuth, their profile needs to be created
                console.log('New OAuth user detected. Creating profile...');
                const roleFromStorage = sessionStorage.getItem('oauth_role') as UserRole | null;
                sessionStorage.removeItem('oauth_role');

                const newProfile = {
                  id: session.user.id,
                  email: session.user.email,
                  name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Nuevo Usuario',
                  age: 18, // Default age
                  role: roleFromStorage || UserRole.INQUILINO, // Use stored role or default
                  avatar_url: session.user.user_metadata.avatar_url,
                  interests: [],
                  lifestyle: [],
                  noise_level: 'Medio' as const,
                  bio: '',
                  is_profile_complete: false, // Force profile completion
                };
                
                const { data: createdProfile, error: insertError } = await supabase
                    .from('profiles')
                    .insert(newProfile)
                    .select()
                    .single();
                
                if (insertError) {
                   console.error("Error creating profile for OAuth user:", insertError);
                   alert("Error creando perfil: " + insertError.message);
                   await supabase.auth.signOut();
                } else if (createdProfile) {
                   console.log('Profile created successfully for OAuth user.');
                   setUsers(prev => [...prev, createdProfile as User]);
                   handleLogin(createdProfile as User);
                }
            }
        } else if (_event === 'SIGNED_OUT') {
            setCurrentUser(null);
            setPage('home');
        }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (user: User) => {
    setUsers(prev => prev.find(u => u.id === user.id) ? prev.map(u => u.id === user.id ? user : u) : [...prev, user]);
    setCurrentUser(user);
    setRegistrationData(null);
    setPublicationData(null);
    
    if (user.role === UserRole.ADMIN) {
        setPage('admin-dashboard');
    } else if (!user.is_profile_complete) {
        // The main render logic will handle the redirection.
    } else if (user.role === UserRole.PROPIETARIO) {
        setPage('owner-dashboard');
    } else {
        setPage('tenant-dashboard');
    }
  };
  
  const handleRegister = async (userData: Partial<User>, password?: string, role?: UserRole) => {
    if (!password || !userData.email) {
      throw new Error("Email y contraseña son requeridos para el registro.");
    }

    // Step 1: Register user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: password,
    });

    if (authError) {
      console.error('Error en el registro de Auth:', authError);
      throw authError; 
    }

    if (!authData.user) {
      throw new Error('Registro completado, pero no se pudo obtener la información del usuario. Por favor, verifica tu email e intenta iniciar sesión.');
    }

    // Step 2: Manually create profile in 'profiles' table
    try {
      const avatar_url = `https://placehold.co/200x200/9ca3af/1f2937?text=${(userData.name || '?').charAt(0)}`;
      
      const baseProfile = {
          id: authData.user.id,
          name: userData.name || 'Nuevo Usuario',
          email: userData.email,
          age: userData.age || 18,
          interests: [],
          lifestyle: [],
          noise_level: 'Medio' as const,
          avatar_url,
          bio: '',
          is_profile_complete: false,
      };

      let targetRole: UserRole;
      if (publicationData) {
          targetRole = UserRole.PROPIETARIO;
      } else if (registrationData) {
          targetRole = UserRole.INQUILINO;
      } else {
          targetRole = role || UserRole.INQUILINO;
      }
      
      const profile_to_insert = { 
          ...baseProfile, 
          role: targetRole,
          city: publicationData?.city || registrationData?.city,
          locality: publicationData?.locality || registrationData?.locality,
          rental_goal: registrationData?.rentalGoal,
      };

      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert(profile_to_insert)
        .select()
        .single();

      if (profileError) {
        throw new Error(`Error al crear el perfil: ${profileError.message}`);
      }
      
      if(newProfile) {
        setUsers(prev => [...prev, newProfile as User]);
      }

      alert('¡Registro exitoso! Por favor, revisa tu correo electrónico para verificar tu cuenta e iniciar sesión.');
      setRegistrationData(null);
      setPublicationData(null);
      setPage('login');
      setLoginInitialMode('login');

    } catch (error: any) {
        console.error("Error en la post-creación del perfil:", error);
        alert(`Tu cuenta fue creada, pero hubo un problema al configurar tu perfil: ${error.message}. Por favor, contacta a soporte.`);
    }
  };
  
  const handleOAuthSignIn = async (role: UserRole) => {
    sessionStorage.setItem('oauth_role', role);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      console.error('Error initiating Google OAuth:', error);
      alert('No se pudo iniciar la sesión con Google: ' + error.message);
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
  
  const handleGoToAccountSettings = () => {
    setAccountInitialTab('profile');
    setPage('account');
  };

  const handleUpdateUser = async (updatedUser: User): Promise<void> => {
    if (!currentUser) {
        throw new Error("No hay un usuario autenticado para actualizar.");
    }

    try {
        const { id, ...dataFromForm } = updatedUser;

        let shouldMarkProfileComplete = false;
        if (!currentUser.is_profile_complete && dataFromForm.bio && dataFromForm.bio.length >= 100) {
            shouldMarkProfileComplete = true;
        }

        const metadataToUpdate: { [key: string]: any } = {};
        if (dataFromForm.name && dataFromForm.name !== currentUser.name) {
            metadataToUpdate.name = dataFromForm.name;
        }
        if (dataFromForm.avatar_url && dataFromForm.avatar_url !== currentUser.avatar_url) {
            metadataToUpdate.avatar_url = dataFromForm.avatar_url;
        }
        
        if (Object.keys(metadataToUpdate).length > 0) {
            const { error: authError } = await supabase.auth.updateUser({
                data: metadataToUpdate
            });
            if (authError) {
                throw new Error(`Error al actualizar metadatos de autenticación: ${authError.message}`);
            }
        }
        
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
            avatar_url: dataFromForm.avatar_url,
            is_profile_complete: shouldMarkProfileComplete ? true : currentUser.is_profile_complete,
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
        
        const finalUser: User = { 
            ...currentUser, 
            ...updatedProfile,
        };

        setCurrentUser(finalUser);
        setUsers(prevUsers => prevUsers.map(u => (u.id === finalUser.id ? finalUser : u)));

    } catch (error: any) {
        console.error("Fallo al guardar el perfil:", error);
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
        .select()
        .single();

      if (error) {
          console.error('Error al actualizar la propiedad:', error);
      } else if (data) {
          setProperties(prev => prev.map(p => p.id === data.id ? data as Property : p));
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
        .select()
        .single();

      if (error) {
        console.error('Error al crear la propiedad:', error);
      } else if (data) {
        setProperties(prev => [...prev, data as Property]);
        
        if (!currentUser.is_profile_complete) {
            const { data: updatedProfile, error: profileError } = await supabase
                .from('profiles')
                .update({ is_profile_complete: true })
                .eq('id', currentUser.id)
                .select()
                .single();

            if (profileError) {
                console.error("Error al marcar perfil de propietario como completo:", profileError);
            } else if (updatedProfile) {
                const finalUser = { ...currentUser, ...updatedProfile };
                setCurrentUser(finalUser);
                setUsers(prev => prev.map(u => u.id === finalUser.id ? finalUser : u));
            }
        }
      }
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

  const handleUpdatePropertyStatus = async (propertyId: number, status: 'approved' | 'rejected') => {
    const { data, error } = await supabase
      .from('properties')
      .update({ status })
      .eq('id', propertyId)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar el estado de la propiedad:', error);
    } else if (data) {
      setProperties(prev => prev.map(p => p.id === propertyId ? data as Property : p));
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
      setProperties(prev => prev.filter(p => p.id !== propertyId));
    }
  };

  const handleSetUserBanStatus = async (userId: string, isBanned: boolean) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_banned: isBanned })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error al actualizar el estado de baneo del usuario:', error);
    } else if (data) {
      setUsers(prev => prev.map(u => u.id === userId ? data as User : u));
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
            onUpdateUser={handleUpdateUser}
        />;
    }
  }

  const renderPage = () => {
    const loginPageProps = { ...pageNavigationProps, onRegisterClick: () => { setLoginInitialMode('register'); setPage('login'); } };
    
    switch (page) {
      case 'home': return <HomePage onStartRegistration={handleStartRegistration} {...pageNavigationProps} onRegisterClick={loginPageProps.onRegisterClick} />;
      case 'owners': return <OwnerLandingPage onStartPublication={handleStartPublication} onLoginClick={handleGoToLogin} onHomeClick={() => setPage('home')} {...pageNavigationProps} />;
      case 'login': return <LoginPage onLogin={handleLogin} onRegister={handleRegister} onOAuthSignIn={handleOAuthSignIn} registrationData={registrationData} publicationData={publicationData} initialMode={loginInitialMode} {...loginPageProps} />;
      case 'blog': return <BlogPage posts={blogPosts} {...loginPageProps} />;
      case 'about': return <AboutPage {...loginPageProps} />;
      case 'privacy': return <PrivacyPolicyPage {...loginPageProps} />;
      case 'terms': return <TermsPage {...loginPageProps} />;
      case 'contact': return <ContactPage {...loginPageProps} />;
      case 'tenant-dashboard':
        if (!currentUser) return <LoginPage onLogin={handleLogin} onRegister={handleRegister} onOAuthSignIn={handleOAuthSignIn} initialMode="login" {...loginPageProps} />;
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
        />;
      case 'owner-dashboard':
        if (!currentUser) return <LoginPage onLogin={handleLogin} onRegister={handleRegister} onOAuthSignIn={handleOAuthSignIn} initialMode="login" {...loginPageProps}/>;
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
            onUpdateUser={handleUpdateUser}
        />;
      case 'admin-dashboard':
        if (!currentUser || currentUser.role !== UserRole.ADMIN) return <LoginPage onLogin={handleLogin} onRegister={handleRegister} onOAuthSignIn={handleOAuthSignIn} initialMode="login" {...loginPageProps} />;
        return <AdminDashboard 
            users={users}
            properties={properties}
            blogPosts={blogPosts}
            matches={matches}
            onUpdatePropertyStatus={handleUpdatePropertyStatus}
            onDeleteProperty={handleDeleteProperty}
            onSetUserBanStatus={handleSetUserBanStatus}
            onSaveBlogPost={handleSaveBlogPost}
            onDeleteBlogPost={handleDeleteBlogPost}
            onLogout={handleLogout}
        />;
      case 'account':
        if (!currentUser) return <LoginPage onLogin={handleLogin} onRegister={handleRegister} onOAuthSignIn={handleOAuthSignIn} initialMode="login" {...loginPageProps} />;
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