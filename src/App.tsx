import React, { useState, useEffect } from 'react';
import './index.css';

// Types
import { User, Property, SavedSearch, RentalGoal, PropertyType, BlogPost, UserRole, Notification } from './types';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OwnerLandingPage from './pages/OwnerLandingPage';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';

// Dashboards & Account
import TenantDashboard from './dashboards/TenantDashboard';
import OwnerDashboard from './dashboards/OwnerDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import AccountLayout from './pages/account/AccountLayout';
import { MOCK_USERS, MOCK_PROPERTIES, MOCK_NOTIFICATIONS, MOCK_SAVED_SEARCHES, MOCK_BLOG_POSTS, MOCK_MATCHES } from './constants';


// Main view types
type View = 
  | 'home' 
  | 'login' 
  | 'register' 
  | 'owner-landing' 
  | 'dashboard' 
  | 'account-settings'
  | 'blog'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('home');

  // App-wide Data State
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(MOCK_SAVED_SEARCHES);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(MOCK_BLOG_POSTS);
  const [matches, setMatches] = useState<{[key: string]: string[]}>(MOCK_MATCHES);

  // Temporary state for registration/publication flow
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    // If a user is logged in, show the dashboard
    if (currentUser) {
      setView('dashboard');
    } else {
      setView('home');
    }
  }, [currentUser]);

  const handleLogin = (email: string) => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
    } else {
      // For demo, log in as first user if not found
      alert('Usuario no encontrado. Iniciando sesión como Elena García.');
      setCurrentUser(users.find(u => u.role === UserRole.INQUILINO));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('home');
  };

  const handleUpdateUser = (updatedUser: User) => {
    const newUsers = users.map(u => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(newUsers);
    if (currentUser && currentUser.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
    alert('Perfil actualizado con éxito');
    setView('dashboard');
  };

  const handleSaveProperty = (propertyData: Omit<Property, 'id' | 'views' | 'compatibleCandidates' | 'owner_id'> & { id?: number }) => {
    if (!currentUser) return;
    
    if (propertyData.id) { // Editing existing property
      setProperties(prev => prev.map(p => p.id === propertyData.id ? { ...p, ...propertyData, price: Number(propertyData.price) } as Property : p));
    } else { // Adding new property
      const newProperty: Property = {
        ...propertyData,
        id: Math.max(...properties.map(p => p.id)) + 1,
        owner_id: currentUser.id,
        price: Number(propertyData.price),
        views: 0,
        compatibleCandidates: 0,
        imageUrls: propertyData.imageUrls || [],
        lat: 40.416775,
        lng: -3.703790,
      };
      setProperties(prev => [...prev, newProperty]);
    }
  };

  const handleDeleteProperty = (propertyId: number) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
  };
  
  const handleUpdatePropertyStatus = (propertyId: number, status: 'approved' | 'rejected') => {
      setProperties(prev => prev.map(p => p.id === propertyId ? {...p, status} : p));
  };

  const handleSaveSearch = (searchData: Omit<SavedSearch, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const newSearch = { ...searchData, id: Date.now(), userId: currentUser.id };
    setSavedSearches(prev => [...prev, newSearch]);
  };
  
  const handleDeleteSearch = (searchId: number) => {
      setSavedSearches(prev => prev.filter(s => s.id !== searchId));
  };

  const handleAddMatch = (matchedUserId: string) => {
    if (!currentUser) return;
    const currentMatches = matches[currentUser.id] || [];
    if (!currentMatches.includes(matchedUserId)) {
      setMatches(prev => ({...prev, [currentUser.id]: [...currentMatches, matchedUserId]}));
    }
  };
  
  const handleSetUserBanStatus = (userId: string, isBanned: boolean) => {
      setUsers(prev => prev.map(u => u.id === userId ? {...u, isBanned} : u));
  };

  const handleSaveBlogPost = (postData: Omit<BlogPost, 'id' | 'slug' | 'author' | 'authorImageUrl' | 'publish_date'> & { id?: number }) => {
      if(postData.id) {
          setBlogPosts(prev => prev.map(p => p.id === postData.id ? {...p, ...postData} as BlogPost : p));
      } else {
          const newPost: BlogPost = {
              ...postData,
              id: Math.max(...blogPosts.map(p => p.id)) + 1,
              slug: postData.title.toLowerCase().replace(/\s+/g, '-'),
              author: "Admin MoOn",
              authorImageUrl: "https://placehold.co/100x100/7c3aed/ffffff?text=M",
              publish_date: new Date().toISOString()
          };
          setBlogPosts(prev => [newPost, ...prev]);
      }
  };
  
  const handleDeleteBlogPost = (postId: number) => {
      setBlogPosts(prev => prev.filter(p => p.id !== postId));
  };

  // --- Render Logic ---
  
  const renderDashboard = () => {
    if (!currentUser) return <LoginPage onLogin={handleLogin} onSwitchToRegister={() => {}} onBackToHome={() => setView('home')} />;
    
    switch (currentUser.role) {
      case UserRole.INQUILINO:
        return <TenantDashboard 
            user={currentUser}
            allUsers={users}
            properties={properties.filter(p => p.status === 'approved')}
            savedSearches={savedSearches}
            userMatches={matches[currentUser.id] || []}
            onSendInterest={() => alert("Interés enviado!")}
            onSaveSearch={handleSaveSearch}
            onDeleteSearch={handleDeleteSearch}
            onAddMatch={handleAddMatch}
            onGoToAccountSettings={() => setView('account-settings')}
        />;
      case UserRole.PROPIETARIO:
        return <OwnerDashboard 
            user={currentUser}
            properties={properties.filter(p => p.owner_id === currentUser.id)}
            onSaveProperty={handleSaveProperty}
            initialPropertyData={initialData}
            onClearInitialPropertyData={() => setInitialData(null)}
        />;
      case UserRole.ADMIN:
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
      default:
        return <LoginPage onLogin={handleLogin} onSwitchToRegister={() => {}} onBackToHome={() => setView('home')}/>;
    }
  };

  const commonPageProps = {
      onBlogClick: () => setView('blog'),
      onAboutClick: () => setView('about'),
      onContactClick: () => setView('contact'),
      onPrivacyClick: () => setView('privacy'),
      onTermsClick: () => setView('terms'),
  };
  
  const renderView = () => {
    switch(view) {
      case 'home':
        return <HomePage 
            {...commonPageProps}
            onLoginClick={() => setView('login')}
            onOwnersClick={() => setView('owner-landing')}
            onStartRegistration={(data) => {
                setInitialData(data);
                setView('login');
                alert(`Iniciando registro para ${data.city} - ${data.locality}. A continuación se mostraría un formulario de registro, por ahora, inicia sesión.`);
            }}
        />;
      case 'login':
      case 'register':
        return <LoginPage onLogin={handleLogin} onSwitchToRegister={() => {}} onBackToHome={() => setView('home')}/>;
      case 'owner-landing':
        return <OwnerLandingPage 
            {...commonPageProps}
            onLoginClick={() => setView('login')}
            onHomeClick={() => setView('home')}
            onStartPublication={(data) => {
              setInitialData(data);
              alert(`Iniciando publicación para ${data.city}. Inicia sesión o regístrate para continuar.`);
              setView('login');
            }}
        />;
      case 'dashboard':
        return renderDashboard();
      case 'account-settings':
        return currentUser ? <AccountLayout 
            {...commonPageProps}
            user={currentUser} 
            onUpdateUser={handleUpdateUser} 
            onLogout={handleLogout} 
            onBack={() => setView('dashboard')}
        /> : <LoginPage onLogin={handleLogin} onSwitchToRegister={() => {}} onBackToHome={() => setView('home')}/>;
      case 'blog':
        return <BlogPage posts={blogPosts} {...commonPageProps} onLoginClick={() => setView('login')} onHomeClick={() => setView('home')} />;
      case 'about':
        return <AboutPage {...commonPageProps} onLoginClick={() => setView('login')} onHomeClick={() => setView('home')} />;
      case 'contact':
        return <ContactPage {...commonPageProps} onLoginClick={() => setView('login')} onHomeClick={() => setView('home')} />;
      case 'privacy':
        return <PrivacyPolicyPage {...commonPageProps} onLoginClick={() => setView('login')} onHomeClick={() => setView('home')} />;
      case 'terms':
        return <TermsPage {...commonPageProps} onLoginClick={() => setView('login')} onHomeClick={() => setView('home')} />;
      default:
        return <h1>Not Found</h1>;
    }
  };

  return <div className="h-screen w-screen">{renderView()}</div>;
};

export default App;