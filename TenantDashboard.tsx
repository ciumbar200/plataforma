import React, { useState, useCallback, useEffect, useMemo } from 'react';
// FIX: Import AVAILABLE_AMENITIES from components/icons and other constants from the main constants file.
import { showNotification } from './constants';
import { AVAILABLE_AMENITIES } from './components/icons';
import UserProfileCard from './dashboards/components/UserProfileCard';
import PropertyCard from './dashboards/components/PropertyCard';
import { CheckIcon, XIcon, CompassIcon, BuildingIcon, HeartIcon, UserCircleIcon, ChevronLeftIcon, PaperAirplaneIcon, EyeIcon, UsersIcon, CalendarIcon, PieChartIcon } from './components/icons';
import GlassCard from './components/GlassCard';
import { User, Property, AmenityId, SavedSearch, UserRole, RentalGoal } from './types';
import GoogleMap from './dashboards/components/GoogleMap';
import SaveSearchModal from './dashboards/components/SaveSearchModal';
import MoonSplit from './dashboards/components/MoonSplit';

// --- START: New Compatibility Calculation Logic ---

const NOISE_LEVEL_MAP: { [key: string]: number } = {
  'Bajo': 1,
  'Medio': 2,
  'Alto': 3,
};

// Max score: 30
const calculateNoiseScore = (userA: User, userB: User): number => {
  const levelA = NOISE_LEVEL_MAP[userA.noiseLevel] || 2;
  const levelB = NOISE_LEVEL_MAP[userB.noiseLevel] || 2;
  const diff = Math.abs(levelA - levelB);
  if (diff === 0) return 30;
  if (diff === 1) return 15;
  return 0;
};

// Max score: 25
const calculateLifestyleScore = (userA: User, userB: User): number => {
  if (!userA.lifestyle || !userB.lifestyle) return 0;
  const sharedLifestyles = userA.lifestyle.filter(style => userB.lifestyle!.includes(style));
  return Math.min(sharedLifestyles.length, 5) * 5;
};

// Max score: 20
const calculateInterestScore = (userA: User, userB: User): number => {
  if (!userA.interests || !userB.interests) return 0;
  const sharedInterests = userA.interests.filter(interest => userB.interests!.includes(interest));
  return Math.min(sharedInterests.length, 10) * 2;
};

// Max score: 15
const calculateCommuteScore = (userA: User, userB: User): number => {
    if (userA.commuteDistance === undefined || userB.commuteDistance === undefined) return 7; // Average score if data is missing
    const diff = Math.abs(userA.commuteDistance - userB.commuteDistance);
    return Math.max(0, 15 - Math.floor(diff / 2));
};

export const calculateCompatibility = (userA: User, userB: User): number => {
  const noiseScore = calculateNoiseScore(userA, userB); // 30
  const lifestyleScore = calculateLifestyleScore(userA, userB); // 25
  const interestScore = calculateInterestScore(userA, userB); // 20
  const commuteScore = calculateCommuteScore(userA, userB); // 15
  
  const totalScore = noiseScore + lifestyleScore + interestScore + commuteScore; // Max 90

  // Add a base of 10 to make the range feel more like 10-100
  const finalScore = Math.round(totalScore) + 10;
  
  return Math.min(finalScore, 100); // Clamp at 100
};
// --- END: New Compatibility Calculation Logic ---

const navItems = [
    { id: 'discover', icon: <CompassIcon className="w-7 h-7" />, label: 'Descubrir' },
    { id: 'properties', icon: <BuildingIcon className="w-7 h-7" />, label: 'Propiedades' },
    { id: 'split', icon: <PieChartIcon className="w-7 h-7" />, label: 'Reparto' },
    { id: 'matches', icon: <HeartIcon className="w-7 h-7" />, label: 'Coincidencias' },
    { id: 'profile', icon: <UserCircleIcon className="w-7 h-7" />, label: 'Mi Perfil' },
] as const;

type View = typeof navItems[number]['id'] | 'propertyDetail';

interface CompatibilityBreakdownModalProps {
  userA: User;
  userB: User;
  onClose: () => void;
}

const rentalGoalText: { [key in RentalGoal]: string } = {
  [RentalGoal.FIND_ROOMMATES_AND_APARTMENT]: 'Encontrar compañeros para un piso',
  [RentalGoal.FIND_ROOM_WITH_ROOMMATES]: 'Encontrar habitación con compañeros',
  [RentalGoal.BOTH]: 'Abierto a ambas opciones',
};

const ScoreItem: React.FC<{ label: string; score: number; maxScore: number; }> = ({ label, score, maxScore }) => {
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-white/90">{label}</span>
                <span className="font-bold text-indigo-300">+{score} pts</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5">
                <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

const CompatibilityBreakdownModal: React.FC<CompatibilityBreakdownModalProps> = ({ userA, userB, onClose }) => {
    const noiseScore = calculateNoiseScore(userA, userB);
    const lifestyleScore = calculateLifestyleScore(userA, userB);
    const interestScore = calculateInterestScore(userA, userB);
    const commuteScore = calculateCommuteScore(userA, userB);
    const sharedInterests = userA.interests.filter(i => userB.interests.includes(i));
    const sharedLifestyles = (userA.lifestyle || []).filter(l => (userB.lifestyle || []).includes(l));

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <GlassCard className="w-full max-w-md text-white relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
                    <XIcon className="w-6 h-6" />
                </button>
                <h3 className="text-2xl font-bold text-center mb-2">Desglose de Compatibilidad</h3>
                <p className="text-center text-white/70 mb-6">con {userB.name.split(' ')[0]}</p>
                
                <div className="space-y-4">
                    <ScoreItem label="Nivel de Ruido" score={noiseScore} maxScore={30} />
                    <ScoreItem label="Estilo de Vida" score={lifestyleScore} maxScore={25} />
                    <ScoreItem label="Intereses Comunes" score={interestScore} maxScore={20} />
                    <ScoreItem label="Distancia de Búsqueda" score={commuteScore} maxScore={15} />
                </div>

                {sharedInterests.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                        <h4 className="font-semibold mb-2 text-white/90">Intereses en común:</h4>
                        <div className="flex flex-wrap gap-2">
                            {sharedInterests.map(interest => (
                                <span key={interest} className="bg-green-500/30 text-sm rounded-full px-3 py-1 font-medium">{interest}</span>
                            ))}
                        </div>
                    </div>
                )}

                {sharedLifestyles.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2 text-white/90">Estilos de vida en común:</h4>
                        <div className="flex flex-wrap gap-2">
                            {sharedLifestyles.map(style => (
                                <span key={style} className="bg-indigo-500/50 text-sm rounded-full px-3 py-1 font-medium">{style}</span>
                            ))}
                        </div>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};


interface TenantDashboardProps {
  user: User;
  allUsers: User[];
  properties: Property[];
  onSendInterest: (property: Property) => void;
  savedSearches: SavedSearch[];
  onSaveSearch: (searchData: Omit<SavedSearch, 'id' | 'userId'>) => void;
  onDeleteSearch: (searchId: number) => void;
  // FIX: User IDs are strings (UUIDs), not numbers. This corrects the type for the user matches array.
  userMatches: string[];
  // FIX: The onAddMatch handler should accept a string to match the user ID type.
  onAddMatch: (matchedUserId: string) => void;
}

const TopNavBar = ({ activeView, setView }: { activeView: View; setView: (view: View) => void }) => {
    return (
        <nav className="hidden md:flex justify-center items-center w-full bg-black/20 backdrop-blur-lg border-b border-white/10 p-2 gap-4">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${activeView === item.id ? 'bg-indigo-500/50 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                >
                    {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                    <span>{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

const BottomNavBar = ({ activeView, setView }: { activeView: View; setView: (view: View) => void }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/30 backdrop-blur-xl border-t border-white/20 z-30 flex justify-around items-center md:hidden">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeView === item.id ? 'text-indigo-400' : 'text-white/70 hover:text-white'}`}
                >
                    {item.icon}
                    <span className="text-xs font-medium">{item.label}</span>
                </button>
            ))}
        </div>
    );
};

const TenantDashboard: React.FC<TenantDashboardProps> = ({ user: currentUser, allUsers, properties, onSendInterest, savedSearches, onSaveSearch, onDeleteSearch, userMatches, onAddMatch }) => {
  const [view, setView] = useState<View>('discover');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentPropertyImageIndex, setCurrentPropertyImageIndex] = useState(0);
  const [interestSent, setInterestSent] = useState(false);
  
  const users = useMemo(() => {
    // FIX: Corrected UserRole from TENANT to INQUILINO to match the enum definition in types.ts.
    const potentialMatches = allUsers.filter(u => u.id !== currentUser.id && u.role === UserRole.INQUILINO);
    return potentialMatches.map(user => ({
      ...user,
      compatibility: calculateCompatibility(currentUser, user),
    })).sort((a, b) => b.compatibility - a.compatibility);
  }, [allUsers, currentUser]);

  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isBreakdownVisible, setIsBreakdownVisible] = useState(false);
  
  // State for property filters
  const [propertySearchQuery, setPropertySearchQuery] = useState('');
  const [selectedPropertyCity, setSelectedPropertyCity] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedAmenities, setSelectedAmenities] = useState<AmenityId[]>([]);
  const [isSaveModalOpen, setSaveModalOpen] = useState(false);
  
  const allPropertyCities = useMemo(() => {
    const cities = new Set(properties.map(p => p.city).filter(Boolean) as string[]);
    return Array.from(cities).sort();
  }, [properties]);

  const allInterests = useMemo(() => {
      // FIX: Corrected UserRole from TENANT to INQUILINO to match the enum definition in types.ts.
      return [...new Set(allUsers.filter(u => u.role === UserRole.INQUILINO).flatMap(user => user.interests))].sort();
  }, [allUsers]);

  // FIX: Changed comparison to a string to match the User ID type (string).
  const isPremiumUser = currentUser.id === '1';

  const userSavedSearches = useMemo(() => {
    return savedSearches.filter(s => s.userId === currentUser.id);
  }, [savedSearches, currentUser.id]);

  const propertiesToShow = useMemo(() => {
    let filtered = properties;

    if (selectedPropertyCity) {
        filtered = filtered.filter(p => p.city === selectedPropertyCity);
    }
    if (propertySearchQuery.trim()) {
        const query = propertySearchQuery.toLowerCase().trim();
        filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(query) || 
            p.address.toLowerCase().includes(query) ||
            p.city?.toLowerCase().includes(query) ||
            p.locality?.toLowerCase().includes(query) ||
            p.postalCode?.includes(query)
        );
    }
    if (priceRange.min) {
        filtered = filtered.filter(p => p.price >= parseInt(priceRange.min, 10));
    }
    if (priceRange.max) {
        filtered = filtered.filter(p => p.price <= parseInt(priceRange.max, 10));
    }
    if (selectedAmenities.length > 0) {
        filtered = filtered.filter(p => p.features && selectedAmenities.every(amenity => p.features![amenity]));
    }
    if (!isPremiumUser) {
        return filtered.filter(p => p.visibility === 'Pública');
    }
    return filtered;
  }, [properties, selectedPropertyCity, propertySearchQuery, priceRange, selectedAmenities, isPremiumUser]);

  const matches = useMemo(() => {
    return allUsers.filter(u => userMatches.includes(u.id));
  }, [allUsers, userMatches]);

  const handleToggleInterest = (interest: string) => {
    setSelectedInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]);
  };

  useEffect(() => {
    const newFilteredUsers = users
      .filter(user => user.city === currentUser.city) // Filter by current user's city
      .filter(user => { // Filter by compatible rental goal
        if (!currentUser.rentalGoal || currentUser.rentalGoal === RentalGoal.BOTH) {
          return true; // Show all if user is open to both
        }
        if (currentUser.rentalGoal === RentalGoal.FIND_ROOM_WITH_ROOMMATES) {
          return user.rentalGoal === RentalGoal.FIND_ROOMMATES_AND_APARTMENT || user.rentalGoal === RentalGoal.BOTH;
        }
        if (currentUser.rentalGoal === RentalGoal.FIND_ROOMMATES_AND_APARTMENT) {
          return user.rentalGoal === RentalGoal.FIND_ROOM_WITH_ROOMMATES || user.rentalGoal === RentalGoal.BOTH;
        }
        return false;
      })
      .filter(user => selectedInterests.length === 0 || selectedInterests.some(interest => user.interests.includes(interest))); // Keep interest filter
    
    setFilteredUsers(newFilteredUsers);
    setCurrentIndex(0);
  }, [currentUser, selectedInterests, users]);

  const handleSwipe = useCallback(() => {
    setCurrentIndex(prevIndex => prevIndex + 1);
  }, []);

  const handleAccept = () => {
    if (currentIndex < filteredUsers.length) {
        const userToMatch = filteredUsers[currentIndex];
        onAddMatch(userToMatch.id);
        showNotification('¡Nueva Coincidencia!', {
            body: `Has hecho match con ${userToMatch.name}. ¡Inicia una conversación!`,
            icon: '/vite.svg',
            tag: `match-${userToMatch.id}`
        });
        handleSwipe();
    }
  };

  const handleReject = () => { handleSwipe(); };
  
  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setCurrentPropertyImageIndex(0);
    setInterestSent(false);
    setView('propertyDetail');
  };

  const handleSendInterest = () => {
      if (selectedProperty) { onSendInterest(selectedProperty); }
      setInterestSent(true);
  };
  
  const handleSaveSearch = (name: string) => {
    onSaveSearch({
      name,
      filters: {
        city: selectedPropertyCity || undefined,
        keyword: propertySearchQuery || undefined,
        minPrice: priceRange.min ? parseInt(priceRange.min, 10) : undefined,
        maxPrice: priceRange.max ? parseInt(priceRange.max, 10) : undefined,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      }
    });
  };

  const handleLoadSearch = (search: SavedSearch) => {
    setSelectedPropertyCity(search.filters.city || '');
    setPropertySearchQuery(search.filters.keyword || '');
    setPriceRange({
      min: search.filters.minPrice?.toString() || '',
      max: search.filters.maxPrice?.toString() || '',
    });
    setSelectedAmenities(search.filters.amenities || []);
  };
  
  const hasMoreProfiles = currentIndex < filteredUsers.length;

  const BackButton = ({ onClick, text }: { onClick: () => void; text: string; }) => (
    <button onClick={onClick} className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors z-20 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
      <ChevronLeftIcon className="w-5 h-5" />
      <span>{text}</span>
    </button>
  );

  const renderDiscover = () => (
    <div className="w-full flex flex-col items-center justify-start">
       {isBreakdownVisible && hasMoreProfiles && (
            <CompatibilityBreakdownModal 
                userA={currentUser}
                userB={filteredUsers[currentIndex]}
                onClose={() => setIsBreakdownVisible(false)}
            />
        )}
        <div className="w-full max-w-md mb-6 text-center">
            <p className="text-white/80">Mostrando perfiles compatibles en <span className="font-semibold text-indigo-300">{currentUser.city}</span></p>
        </div>

      <div className="w-full max-w-sm h-[550px] relative">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <div key={user.id} className={`absolute w-full h-full transition-all duration-500 ease-in-out ${index === currentIndex ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95 pointer-events-none'}`} style={{ zIndex: filteredUsers.length - index }}>
              {index === currentIndex && <UserProfileCard user={user} onCompatibilityClick={() => setIsBreakdownVisible(true)} />}
            </div>
          ))
        ) : (
          <GlassCard className="w-full h-full flex flex-col justify-center items-center text-center"><h3 className="text-xl font-bold text-white mb-2">No se encontraron coincidencias</h3><p className="text-white/80">Intenta seleccionar otros intereses o ciudad.</p></GlassCard>
        )}
        {!hasMoreProfiles && filteredUsers.length > 0 && (<GlassCard className="w-full h-full flex flex-col justify-center items-center text-center"><h3 className="text-xl font-bold text-white mb-2">¡Eso es todo!</h3><p className="text-white/80">Has visto todos los perfiles. Prueba a cambiar los filtros.</p></GlassCard>)}
      </div>
      
      <div className="w-full max-w-sm mt-8 flex flex-col items-center gap-6">
        <div className="flex gap-8">
            <button onClick={handleReject} disabled={!hasMoreProfiles} className="bg-red-500/80 backdrop-blur-sm rounded-full p-5 text-white shadow-lg border-2 border-red-400 hover:bg-red-500 transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100" aria-label="Rechazar perfil"><XIcon /></button>
            <button onClick={handleAccept} disabled={!hasMoreProfiles} className="bg-green-500/80 backdrop-blur-sm rounded-full p-5 text-white shadow-lg border-2 border-green-400 hover:bg-green-500 transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100" aria-label="Aceptar perfil"><CheckIcon /></button>
        </div>
        
        {hasMoreProfiles && (
            <div className="w-full">
                <h4 className="text-center font-semibold text-white/80 mb-3">Intereses de {filteredUsers[currentIndex].name.split(' ')[0]}</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                    {filteredUsers[currentIndex].interests.map(interest => {
                        const isShared = currentUser.interests.includes(interest);
                        return (<span key={interest} className={`px-3 py-1 text-sm rounded-full transition-colors border ${isShared ? 'bg-green-500/30 border-green-400 text-white font-semibold' : 'bg-white/10 border-white/20 text-white/80'}`}>{interest}</span>);
                    })}
                </div>
            </div>
        )}

        <div className="w-full mt-4 pt-6 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white/90 mb-3 text-center">Filtrar por Intereses</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {allInterests.map(interest => (
                <button key={interest} onClick={() => handleToggleInterest(interest)} className={`px-3 py-1 text-sm rounded-full transition-colors border ${selectedInterests.includes(interest) ? 'bg-indigo-500 border-indigo-400 text-white font-semibold' : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'}`}>
                  {interest}
                </button>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
  
  const renderProperties = () => {
    return (
        <div className="w-full h-full flex flex-col">
            <SaveSearchModal isOpen={isSaveModalOpen} onClose={() => setSaveModalOpen(false)} onSave={handleSaveSearch} />
            <h2 className="text-3xl font-bold text-center mb-2">Propiedades Disponibles</h2>
            {isPremiumUser && <p className="text-center text-indigo-300 mb-4 font-semibold">Acceso Premium: Viendo todas las propiedades.</p>}

            <GlassCard className="w-full max-w-6xl mx-auto mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <input type="text" placeholder="Buscar por título o dirección..." value={propertySearchQuery} onChange={(e) => setPropertySearchQuery(e.target.value)} className="lg:col-span-2 w-full bg-white/10 border border-white/20 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500" />
                    <select value={selectedPropertyCity} onChange={(e) => setSelectedPropertyCity(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="" className="bg-gray-800">Todas las ciudades</option>
                        {allPropertyCities.map(city => <option key={city} value={city} className="bg-gray-800">{city}</option>)}
                    </select>
                    <div className="flex gap-2">
                        <input type="number" placeholder="Precio Mín." value={priceRange.min} onChange={e => setPriceRange(p => ({...p, min: e.target.value}))} className="w-full bg-white/10 border border-white/20 rounded-lg p-2.5 outline-none" />
                        <input type="number" placeholder="Precio Máx." value={priceRange.max} onChange={e => setPriceRange(p => ({...p, max: e.target.value}))} className="w-full bg-white/10 border border-white/20 rounded-lg p-2.5 outline-none" />
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-white/80 mb-2">Filtrar por servicios</h4>
                    <div className="flex flex-wrap gap-2">
                        {AVAILABLE_AMENITIES.map(amenity => (
                            <button key={amenity.id} onClick={() => setSelectedAmenities(prev => prev.includes(amenity.id) ? prev.filter(i => i !== amenity.id) : [...prev, amenity.id])} className={`px-3 py-1 text-xs rounded-full transition-colors border ${selectedAmenities.includes(amenity.id) ? 'bg-indigo-500 border-indigo-400 text-white font-semibold' : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'}`}>
                                {amenity.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="border-t border-white/10 mt-4 pt-4 flex justify-end">
                    <button onClick={() => setSaveModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Guardar Búsqueda</button>
                </div>
            </GlassCard>

            {userSavedSearches.length > 0 && (
                <div className="w-full max-w-6xl mx-auto mb-6">
                    <h3 className="text-xl font-bold mb-3">Mis Búsquedas Guardadas</h3>
                    <div className="flex flex-wrap gap-3">
                        {userSavedSearches.map(search => (
                            <div key={search.id} className="bg-black/20 backdrop-blur-sm p-3 rounded-lg flex items-center gap-3 border border-white/10">
                                <span className="font-semibold">{search.name}</span>
                                <button onClick={() => handleLoadSearch(search)} className="text-sm text-indigo-400 hover:underline">Cargar</button>
                                <button onClick={() => onDeleteSearch(search.id)} className="text-sm text-red-400 hover:underline">Borrar</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {propertiesToShow.length > 0 ? (
                <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
                    {propertiesToShow.map(prop => <PropertyCard key={prop.id} property={prop} onCardClick={handlePropertyClick} />)}
                </div>
            ) : (
                <GlassCard className="w-full max-w-6xl mx-auto flex-grow flex items-center justify-center min-h-[300px]">
                    <div className="text-center"><h3 className="text-xl font-bold">No se encontraron propiedades</h3><p className="text-white/70 mt-2">Prueba a cambiar los filtros de búsqueda.</p></div>
                </GlassCard>
            )}
        </div>
    );
  };

  const renderMatches = () => {
    return (
        <div className="w-full h-full flex flex-col">
            <h2 className="text-3xl font-bold text-center mb-6">Mis Coincidencias</h2>
            <div className="w-full max-w-6xl mx-auto flex-grow">
                {matches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matches.map(user => (<div key={user.id} className="h-[450px]"><UserProfileCard user={user} /></div>))}
                    </div>
                ) : (
                    <GlassCard className="h-full min-h-[400px] flex flex-col justify-center items-center text-center">
                        <HeartIcon className="w-16 h-16 text-white/30 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Aún no tienes coincidencias</h3>
                        <p className="text-white/80">¡Ve a "Descubrir" para empezar a conectar!</p>
                    </GlassCard>
                )}
            </div>
        </div>
      );
  };

  const renderProfile = () => (
    <div className="w-full h-full flex flex-col">
        <h2 className="text-3xl font-bold text-center mb-6">Mi Perfil</h2>
        <div className="w-full max-w-4xl mx-auto flex-grow">
            <GlassCard className="!p-8">
                <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                    <img src={currentUser.profilePicture} alt={currentUser.name} className="w-40 h-40 rounded-full object-cover border-4 border-indigo-400 shadow-lg" />
                    <div>
                        <h3 className="text-4xl font-bold">{currentUser.name}, {currentUser.age}</h3>
                        <p className="text-white/80 mt-2 text-lg italic">"{currentUser.bio || 'Sin biografía.'}"</p>
                    </div>
                </div>
                <div className="my-8 border-t border-white/20"></div>
                <div className="flex flex-col gap-8">
                    <div>
                        <h4 className="text-2xl font-bold mb-4">Estilo de Vida y Preferencias</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-black/20 p-6 rounded-xl">
                            <div className="text-center"><p className="text-sm text-indigo-300 font-semibold uppercase tracking-wider">Nivel de Ruido</p><p className="text-2xl font-bold mt-1">{currentUser.noiseLevel}</p></div>
                            <div className="text-center"><p className="text-sm text-indigo-300 font-semibold uppercase tracking-wider">Búsqueda Máxima</p><p className="text-2xl font-bold mt-1">{currentUser.commuteDistance || 'N/A'}<span className="text-lg text-white/70"> min</span></p></div>
                            <div className="text-center">
                                <p className="text-sm text-indigo-300 font-semibold uppercase tracking-wider mb-2">Etiquetas</p>
                                <div className="flex flex-wrap gap-2 justify-center">{currentUser.lifestyle?.map(style => (<span key={style} className="bg-indigo-500/50 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold">{style}</span>))}</div>
                            </div>
                             <div className="text-center sm:col-span-2 lg:col-span-3 border-t border-white/10 pt-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-indigo-300 font-semibold uppercase tracking-wider">Mi Ubicación</p>
                                    <p className="text-xl font-bold mt-1">{currentUser.city}, {currentUser.locality}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-indigo-300 font-semibold uppercase tracking-wider">Mi Objetivo</p>
                                    <p className="text-lg font-bold mt-1 text-white/90">{currentUser.rentalGoal ? rentalGoalText[currentUser.rentalGoal] : 'No especificado'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold mb-4">Nube de Aficiones</h4>
                        <div className="bg-black/20 p-6 rounded-xl"><div className="flex flex-wrap gap-3 justify-center">{currentUser.interests.map(interest => (<span key={interest} className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-md">{interest}</span>))}</div></div>
                    </div>
                </div>
            </GlassCard>
        </div>
    </div>
  );

  const renderPropertyDetail = () => {
      if (!selectedProperty) return null;
      const nextImage = () => { setCurrentPropertyImageIndex(prev => (prev + 1) % selectedProperty.imageUrls.length); };
      const prevImage = () => { setCurrentPropertyImageIndex(prev => (prev - 1 + selectedProperty.imageUrls.length) % selectedProperty.imageUrls.length); };
      const availableAmenities = AVAILABLE_AMENITIES.filter(amenity => selectedProperty.features && selectedProperty.features[amenity.id]);
      const formattedDate = new Date(selectedProperty.availableFrom + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
      const fullAddress = [selectedProperty.address, selectedProperty.locality, selectedProperty.city, selectedProperty.postalCode].filter(Boolean).join(', ');

      return (
          <div className="w-full flex flex-col relative">
              <BackButton onClick={() => setView('properties')} text="Volver a Propiedades" />
              <div className="w-full max-w-5xl mx-auto flex-grow">
                  <GlassCard className="!p-0 overflow-hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                           <div className="relative w-full h-full min-h-[300px] lg:min-h-full">
                                <img src={selectedProperty.imageUrls[currentPropertyImageIndex]} alt={selectedProperty.title} className="w-full h-full object-cover" />
                                {selectedProperty.imageUrls.length > 1 && (
                                    <>
                                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"><ChevronLeftIcon className="w-6 h-6" /></button>
                                        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"><ChevronLeftIcon className="w-6 h-6 transform rotate-180" /></button>
                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">{selectedProperty.imageUrls.map((_, index) => (<div key={index} className={`w-2 h-2 rounded-full transition-colors ${index === currentPropertyImageIndex ? 'bg-white' : 'bg-white/50'}`}></div>))}</div>
                                    </>
                                )}
                            </div>
                          <div className="p-8 flex flex-col">
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full self-start mb-2 ${selectedProperty.visibility === 'Pública' ? 'bg-green-500' : 'bg-yellow-500'}`}>{selectedProperty.visibility}</span>
                              <h2 className="text-4xl font-bold mb-2">{selectedProperty.title}</h2>
                              <div className="flex items-baseline gap-3 mb-4">
                                <span className="bg-indigo-500/50 text-indigo-200 font-semibold px-3 py-1 rounded-full text-sm">{selectedProperty.propertyType}</span>
                                <p className="text-md text-white/70">{fullAddress}</p>
                              </div>
                              {/* FIX: Corrected currency symbol from '$' to '€' for consistency. */}
                              <p className="text-4xl font-bold mb-6 text-indigo-300">€{selectedProperty.price}<span className="text-lg font-normal text-white/70">/mes</span></p>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-white/80 border-t border-white/20 pt-4 mb-6 text-center">
                                  <div className="flex items-center justify-center gap-2"><EyeIcon className="w-5 h-5" /><span>{selectedProperty.views.toLocaleString()} visitas</span></div>
                                  <div className="flex items-center justify-center gap-2"><UsersIcon className="w-5 h-5" /><span>{selectedProperty.compatibleCandidates} candidatos</span></div>
                                  <div className="flex items-center justify-center gap-2 text-green-300 font-semibold"><CalendarIcon className="w-5 h-5" /><span>Disponible: {formattedDate}</span></div>
                              </div>
                              {availableAmenities.length > 0 && (<div className="mb-6"><h3 className="text-xl font-bold mb-3">Comodidades</h3><div className="flex flex-wrap gap-x-6 gap-y-3">{availableAmenities.map(amenity => (<div key={amenity.id} className="flex items-center gap-2 text-white/90">{React.cloneElement(amenity.icon, { className: 'w-5 h-5 text-indigo-300' })}<span className="text-sm">{amenity.label}</span></div>))}</div></div>)}
                              {selectedProperty.conditions && (<div className="mb-8"><h3 className="text-xl font-bold mb-3">Condiciones</h3><p className="text-sm text-white/80 whitespace-pre-wrap">{selectedProperty.conditions}</p></div>)}
                              {selectedProperty.lat != null && selectedProperty.lng != null && (<div className="mb-8"><h3 className="text-xl font-bold mb-3">Ubicación</h3><div className="rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg"><GoogleMap lat={selectedProperty.lat} lng={selectedProperty.lng} /></div></div>)}
                              <div className="mt-auto">{interestSent ? (<div className="text-center bg-green-500/20 border border-green-500 text-green-300 font-semibold p-4 rounded-lg flex flex-col items-center gap-2"><CheckIcon className="w-8 h-8 text-green-400" /><div><p>¡Tu interés ha sido enviado!</p><p className="text-sm font-normal">El propietario se pondrá en contacto contigo.</p></div></div>) : (<button onClick={handleSendInterest} className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg transition-colors text-lg"><PaperAirplaneIcon className="w-6 h-6" /><span>Enviar Interés al Propietario</span></button>)}</div>
                          </div>
                      </div>
                  </GlassCard>
              </div>
          </div>
      );
  };
  
  const renderContent = () => {
      switch (view) {
          case 'discover': return renderDiscover();
          case 'properties': return renderProperties();
          case 'propertyDetail': return renderPropertyDetail();
          case 'split': return <MoonSplit />;
          case 'matches': return renderMatches();
          case 'profile': return renderProfile();
          default: return renderDiscover();
      }
  };

  return (
    <div className="h-full w-full flex flex-col">
        <TopNavBar activeView={view} setView={setView} />
        <main className="flex-1 overflow-y-auto">
             <div className="p-6 md:pb-6 pb-24">
                {renderContent()}
            </div>
        </main>
        <BottomNavBar activeView={view} setView={setView} />
    </div>
  );
};

export default TenantDashboard;
