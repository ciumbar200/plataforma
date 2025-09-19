
import React, { useState, useCallback } from 'react';
import HomePage from '../pages/HomePage';
import OwnerLandingPage from '../pages/OwnerLandingPage';
import LoginPage from './pages/LoginPage';
import TenantDashboard from '../dashboards/TenantDashboard';
import OwnerDashboard from '../dashboards/OwnerDashboard';
import AdminDashboard from '../dashboards/AdminDashboard';
import AccountLayout from '../pages/account/AccountLayout';
import BlogPage from '../pages/BlogPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import TermsPage from '../pages/TermsPage';
import { User, UserRole, RentalGoal, Property, PropertyType, SavedSearch, BlogPost, Notification } from './types';
import { MOCK_USERS, MOCK_PROPERTIES, MOCK_SAVED_SEARCHES, MOCK_BLOG_POSTS, MOCK_NOTIFICATIONS, MOCK_MATCHES } from '../constants';

type Page = 'home' | 'owners' | 'login' | 'tenant-dashboard' | 'owner-dashboard' | 'admin-dashboard' | 'account' | 'blog' | 'about' | 'privacy' | 'terms' | 'contact';

type RegistrationData = { rentalGoal: RentalGoal; city: string; locality: string };
type PublicationData = { propertyType: PropertyType; city: string; locality: string };

function App() {
  const [page, setPage] = useState<Page>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(MOCK_SAVED_SEARCHES);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(MOCK_BLOG_POSTS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [matches, setMatches] = useState<{ [key: string]: string[] }>(MOCK_MATCHES);

  const [publicationData, setPublicationData] = useState<PublicationData | null>(null);
  const [accountInitialTab, setAccountInitialTab] = useState<string>('overview');

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === UserRole.ADMIN) setPage('admin-dashboard');
    else if (user.role === UserRole.PROPIETARIO) setPage('owner-dashboard');
    else setPage('tenant-dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage('home');
  };

  const handleStartRegistration = (data: RegistrationData) => {
    setPage('login');
  };

  const handleStartPublication = (data: PublicationData) => {
    setPublicationData(data);
    setPage('login');
  };

  const handleUpdateUser = (updatedUser: User) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedUser };
    setCurrentUser(updated);
    setUsers(users.map(u => u.id === updated.id ? updated : u));
    alert('Perfil actualizado');
    setPage(currentUser.role === UserRole.INQUILINO ? 'tenant-dashboard' : 'owner-dashboard');
  };

  const handleSaveProperty = (propertyData: Omit<Property, 'id' | 'views' | 'compatibleCandidates' | 'owner_id'> & { id?: number }) => {
    if (!currentUser) return;
    if (propertyData.id) {
      setProperties(properties.map(p => p.id === propertyData.id ? { ...p, ...propertyData, price: Number(propertyData.price) } as Property : p));
    } else {
      const newProperty: Property = {
        ...propertyData,
        id: Math.max(0, ...properties.map(p => p.id)) + 1,
        owner_id: currentUser.id,
        views: 0,
        compatibleCandidates: 0,
        price: Number(propertyData.price),
        status: 'pending',
      };
      setProperties(prev => [...prev, newProperty]);
    }
  };

  const handleAddMatch = (matchedUserId: string) => {
    if (!currentUser) return;
    const currentMatches = matches[currentUser.id] || [];
    if (!currentMatches.includes(matchedUserId)) {
        setMatches(prev => ({ ...prev, [currentUser.id]: [...currentMatches, matchedUserId] }));
    }
  };

  const handleUpdatePropertyStatus = (propertyId: number, status: 'approved' | 'rejected') => {
    setProperties(properties.map(p => p.id === propertyId ? { ...p, status } : p));
  };
  
  const handleDeleteProperty = (propertyId: number) => {
    setProperties(properties.filter(p => p.id !== propertyId));
  };

  const handleSetUserBanStatus = (userId: string, isBanned: boolean) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isBanned } : u));
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
            authorImageUrl: currentUser?.profilePicture || '',
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

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage onStartRegistration={handleStartRegistration} {...pageNavigationProps} />;
      case 'owners': return <OwnerLandingPage onStartPublication={handleStartPublication} {...pageNavigationProps} />;
      case 'login': return <LoginPage onLogin={handleLogin} users={users} {...pageNavigationProps} />;
      case 'blog': return <BlogPage posts={blogPosts} {...pageNavigationProps} />;
      case 'about': return <AboutPage {...pageNavigationProps} />;
      case 'privacy': return <PrivacyPolicyPage {...pageNavigationProps} />;
      case 'terms': return <TermsPage {...pageNavigationProps} />;
      case 'contact': return <ContactPage {...pageNavigationProps} />;
      case 'tenant-dashboard':
        if (!currentUser) return <LoginPage onLogin={handleLogin} users={users} {...pageNavigationProps} />;
        return <TenantDashboard 
            user={currentUser} 
            allUsers={users}
            properties={properties.filter(p => p.status === 'approved')}
            onSendInterest={() => alert('Interés enviado (simulación)')}
            savedSearches={savedSearches}
            onSaveSearch={(search) => setSavedSearches([...savedSearches, {...search, id: Date.now(), userId: currentUser.id}])}
            onDeleteSearch={(id) => setSavedSearches(savedSearches.filter(s => s.id !== id))}
            userMatches={matches[currentUser.id] || []}
            onAddMatch={handleAddMatch}
            onGoToAccountSettings={() => { setAccountInitialTab('profile'); setPage('account'); }}
        />;
      case 'owner-dashboard':
        if (!currentUser) return <LoginPage onLogin={handleLogin} users={users} {...pageNavigationProps} />;
        return <OwnerDashboard 
            user={currentUser}
            properties={properties.filter(p => p.owner_id === currentUser.id)}
            onSaveProperty={handleSaveProperty}
            initialPropertyData={publicationData}
            onClearInitialPropertyData={() => setPublicationData(null)}
        />;
      case 'admin-dashboard':
        if (!currentUser || currentUser.role !== UserRole.ADMIN) return <LoginPage onLogin={handleLogin} users={users} {...pageNavigationProps} />;
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
        if (!currentUser) return <LoginPage onLogin={handleLogin} users={users} {...pageNavigationProps} />;
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

  return <div className="h-screen w-screen bg-gray-900">{renderPage()}</div>;
}

export default App;
