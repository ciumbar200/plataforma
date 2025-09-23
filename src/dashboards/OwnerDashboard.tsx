import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from './components/StatCard';
import { BuildingIcon, ChartBarIcon, EyeIcon, UsersIcon, UserCircleIcon, PlusIcon, ChevronLeftIcon } from '../components/icons';
import PropertyCard from './components/PropertyCard';
import AddPropertyModal from './components/AddPropertyModal';
import { Property, User, PropertyType, OwnerStats, UserRole, RentalGoal } from '../types';
import GlassCard from '../components/GlassCard';
import CandidateGroupCard from './components/CandidateGroupCard';

const MOCK_OWNER_STATS: OwnerStats = {
    monthlyEarnings: [
        { name: 'Ene', earnings: 4000 },
        { name: 'Feb', earnings: 3000 },
        { name: 'Mar', earnings: 2000 },
        { name: 'Abr', earnings: 2780 },
        { name: 'May', earnings: 1890 },
        { name: 'Jun', earnings: 2390 },
        { name: 'Jul', earnings: 3490 },
    ],
    totalProperties: 5,
    totalViews: 12500,
    totalCandidates: 340,
};

type InitialPropertyData = { property_type: PropertyType; city: string; locality: string };

interface OwnerDashboardProps {
    user: User;
    properties: Property[];
    onSaveProperty: (propertyData: Omit<Property, 'id' | 'views' | 'compatible_candidates' | 'owner_id'> & { id?: number }) => void;
    initialPropertyData: InitialPropertyData | null;
    onClearInitialPropertyData: () => void;
    allUsers: User[];
    matches: { [key: string]: string[] };
}

const navItems = [
    { id: 'dashboard', icon: <ChartBarIcon className="w-7 h-7" />, label: 'Panel' },
    { id: 'properties', icon: <BuildingIcon className="w-7 h-7" />, label: 'Propiedades' },
    { id: 'profile', icon: <UserCircleIcon className="w-7 h-7" />, label: 'Mi Perfil' },
] as const;

type View = typeof navItems[number]['id'] | 'propertyDetail';

const TopNavBar = ({ activeView, setView, onAddNew }: { activeView: View; setView: (view: View) => void; onAddNew: () => void; }) => (
    <nav className="hidden md:flex justify-between items-center w-full bg-black/20 backdrop-blur-lg border-b border-white/10 p-2 px-6">
        <div className="flex items-center gap-2">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-semibold ${activeView === item.id ? 'bg-purple-500/50 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                >
                    {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                    <span>{item.label}</span>
                </button>
            ))}
        </div>
        <button 
            onClick={onAddNew} 
            className="flex items-center gap-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            aria-label="Añadir nueva propiedad"
        >
            <PlusIcon className="w-5 h-5" />
            <span>Añadir Propiedad</span>
        </button>
    </nav>
);

const BottomNavBar = ({ activeView, setView, onAddNew }: { activeView: View; setView: (view: View) => void; onAddNew: () => void; }) => (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/30 backdrop-blur-xl border-t border-white/20 z-30 grid grid-cols-4 items-center md:hidden">
        <button
            onClick={() => setView('dashboard')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeView === 'dashboard' ? 'text-purple-400' : 'text-white/70 hover:text-white'}`}
        >
            {navItems[0].icon}
            <span className="text-xs font-medium">{navItems[0].label}</span>
        </button>
         <button
            onClick={() => setView('properties')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeView === 'properties' ? 'text-purple-400' : 'text-white/70 hover:text-white'}`}
        >
            {navItems[1].icon}
            <span className="text-xs font-medium">{navItems[1].label}</span>
        </button>
         <button
            onClick={onAddNew}
            className="flex flex-col items-center justify-center gap-1 transition-colors text-white bg-indigo-600 h-14 w-14 rounded-full mx-auto -translate-y-4 shadow-lg border-2 border-indigo-400"
            aria-label="Añadir nueva propiedad"
        >
            <PlusIcon className="w-7 h-7" />
        </button>
          <button
            onClick={() => setView('profile')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeView === 'profile' ? 'text-purple-400' : 'text-white/70 hover:text-white'}`}
        >
            {navItems[2].icon}
            <span className="text-xs font-medium">{navItems[2].label}</span>
        </button>
    </div>
);

const BackButton = ({ onClick, text }: { onClick: () => void; text: string; }) => (
    <button onClick={onClick} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors z-10 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10 mb-4">
      <ChevronLeftIcon className="w-5 h-5" />
      <span>{text}</span>
    </button>
);

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ user, properties, onSaveProperty, initialPropertyData, onClearInitialPropertyData, allUsers, matches }) => {
    const [view, setView] = useState<View>('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [invitedGroups, setInvitedGroups] = useState<string[]>([]);

    useEffect(() => {
        if (initialPropertyData) {
            setPropertyToEdit(null);
            setIsModalOpen(true);
        }
    }, [initialPropertyData]);

    const handleAddNew = () => {
        setPropertyToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (property: Property) => {
        setPropertyToEdit(property);
        setIsModalOpen(true);
    };
    
    const handlePropertyClick = (property: Property) => {
        setSelectedProperty(property);
        setCurrentImageIndex(0);
        setInvitedGroups([]); // Reset invitations when viewing a new property
        setView('propertyDetail');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPropertyToEdit(null);
        if (initialPropertyData) {
            onClearInitialPropertyData();
        }
    };

    const handleSaveAndClose = (propertyData: Omit<Property, 'id' | 'views' | 'compatible_candidates' | 'owner_id'> & { id?: number }) => {
        onSaveProperty(propertyData);
        handleCloseModal();
    };

    const tenantGroups = useMemo(() => {
        const tenants = allUsers.filter(u => u.role === UserRole.INQUILINO && (u.rental_goal === RentalGoal.FIND_ROOMMATES_AND_APARTMENT || u.rental_goal === RentalGoal.BOTH));
        
        const isMutualMatch = (id1: string, id2: string) => {
            const matches1 = matches[id1] || [];
            const matches2 = matches[id2] || [];
            return matches1.includes(id2) && matches2.includes(id1);
        };

        const groups: User[][] = [];
        const processedUsers = new Set<string>();

        // Find groups of 3
        for (let i = 0; i < tenants.length; i++) {
            const userA = tenants[i];
            if (processedUsers.has(userA.id)) continue;

            for (let j = i + 1; j < tenants.length; j++) {
                const userB = tenants[j];
                if (processedUsers.has(userB.id)) continue;
                
                if (isMutualMatch(userA.id, userB.id)) {
                    for (let k = j + 1; k < tenants.length; k++) {
                        const userC = tenants[k];
                        if (processedUsers.has(userC.id)) continue;

                        if (isMutualMatch(userA.id, userC.id) && isMutualMatch(userB.id, userC.id)) {
                            groups.push([userA, userB, userC]);
                            processedUsers.add(userA.id);
                            processedUsers.add(userB.id);
                            processedUsers.add(userC.id);
                            break; 
                        }
                    }
                }
                if (processedUsers.has(userA.id)) break;
            }
        }
        
        // Find groups of 2 from remaining users
        for (let i = 0; i < tenants.length; i++) {
            const userA = tenants[i];
            if (processedUsers.has(userA.id)) continue;
            
            for (let j = i + 1; j < tenants.length; j++) {
                const userB = tenants[j];
                if (processedUsers.has(userB.id)) continue;

                if (isMutualMatch(userA.id, userB.id)) {
                    groups.push([userA, userB]);
                    processedUsers.add(userA.id);
                    processedUsers.add(userB.id);
                    break;
                }
            }
        }
        return groups;
    }, [allUsers, matches]);

    const handleInviteGroup = (group: User[]) => {
        const groupId = group.map(u => u.id).sort().join('-');
        setInvitedGroups(prev => [...prev, groupId]);
        alert(`Grupo de ${group.map(u => u.name).join(', ')} ha sido notificado sobre la propiedad.`);
    };

    const renderDashboardView = () => (
        <>
            <h2 className="text-3xl font-bold mb-6">Panel General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    icon={<ChartBarIcon className="w-7 h-7 text-white" />}
                    title="Ingresos Totales"
                    value={`€${MOCK_OWNER_STATS.monthlyEarnings.reduce((acc, item) => acc + item.earnings, 0).toLocaleString()}`}
                    color="green"
                />
                <StatCard 
                    icon={<BuildingIcon className="w-7 h-7 text-white" />}
                    title="Propiedades Listadas"
                    value={properties.length.toString()}
                    color="indigo"
                />
                <StatCard 
                    icon={<EyeIcon className="w-7 h-7 text-white" />}
                    title="Visitas Totales"
                    value={properties.reduce((acc, p) => acc + p.views, 0).toLocaleString()}
                    color="blue"
                />
                <StatCard 
                    icon={<UsersIcon className="w-7 h-7 text-white" />}
                    title="Candidatos Totales"
                    value={properties.reduce((acc, p) => acc + p.compatible_candidates, 0).toLocaleString()}
                    color="purple"
                />
            </div>
             <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Ingresos Mensuales</h3>
                <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_OWNER_STATS.monthlyEarnings} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                            <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.7)" />
                            <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                                    borderColor: 'rgba(255, 255, 255, 0.2)',
                                    borderRadius: '0.75rem'
                                }}
                                cursor={{fill: 'rgba(124, 58, 237, 0.2)'}}
                            />
                            <Legend wrapperStyle={{color: '#fff'}}/>
                            <Bar dataKey="earnings" name="Ingresos" fill="rgba(139, 92, 246, 0.8)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );

    const renderPropertiesView = () => (
         <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Mis Propiedades</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.length > 0 ? (
                    properties.map(prop => (
                        <PropertyCard key={prop.id} property={prop} onEdit={handleEdit} onCardClick={handlePropertyClick} />
                    ))
                ) : (
                    <GlassCard className="md:col-span-2 lg:col-span-3 min-h-[200px] flex items-center justify-center">
                        <p className="text-center text-white/70">Aún no has añadido ninguna propiedad.</p>
                    </GlassCard>
                )}
            </div>
        </>
    );

    const renderProfileView = () => (
         <>
            <h2 className="text-3xl font-bold text-center mb-6">Mi Perfil</h2>
            <div className="w-full max-w-4xl mx-auto">
                <GlassCard className="!p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                        <img src={user.avatar_url} alt={user.name} className="w-40 h-40 rounded-full object-cover border-4 border-purple-400 shadow-lg" />
                        <div>
                            <h3 className="text-4xl font-bold">{user.name}</h3>
                            {user.city && <p className="text-lg text-cyan-400 mt-1">{user.city}, {user.locality}</p>}
                            <p className="text-white/80 mt-2 text-lg italic">"{user.bio || 'Sin biografía. Haz clic en "Editar Perfil" en el menú de la esquina superior derecha para añadir una.'}"</p>
                        </div>
                    </div>
                    <div className="my-8 border-t border-white/20"></div>
                    <div className="text-center">
                        <p className="text-white/70">Para editar los detalles de tu perfil, haz clic en tu foto de perfil en la esquina superior derecha y selecciona "Editar Perfil".</p>
                    </div>
                </GlassCard>
            </div>
        </>
    );
    
    const renderPropertyDetailView = () => {
        if (!selectedProperty) return null;
        const images = selectedProperty.image_urls || [];
        const nextImage = () => { if (images.length > 0) setCurrentImageIndex(prev => (prev + 1) % images.length); };
        const prevImage = () => { if (images.length > 0) setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length); };

        return (
            <div>
                <BackButton onClick={() => setView('properties')} text="Volver a mis Propiedades" />
                <GlassCard>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">{selectedProperty.title}</h2>
                            <p className="text-white/70 mb-4">{selectedProperty.address}</p>
                            <div className="relative mb-4">
                                <img src={images.length > 0 ? images[currentImageIndex] : 'https://placehold.co/800x600/1e1b4b/ffffff?text=Sin+Imagen'} alt={selectedProperty.title} className="w-full h-64 object-cover rounded-lg" />
                                {images.length > 1 && (
                                    <>
                                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"><ChevronLeftIcon className="w-6 h-6" /></button>
                                        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"><ChevronLeftIcon className="w-6 h-6 transform rotate-180" /></button>
                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">{images.map((_, index) => (<button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}></button>))}</div>
                                    </>
                                )}
                            </div>
                            <p className="text-lg">{selectedProperty.conditions}</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Grupos de Candidatos</h3>
                            {selectedProperty.visibility === 'Pública' && (
                                <div className="text-center p-6 bg-black/20 rounded-lg">
                                    <p className="text-white/80">Esta propiedad es pública. Los candidatos pueden mostrar interés directamente.</p>
                                </div>
                            )}
                            {selectedProperty.visibility === 'Privada' && (
                                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                    {tenantGroups.length > 0 ? (
                                        tenantGroups.map((group) => {
                                            const groupId = group.map(u => u.id).sort().join('-');
                                            return (
                                                <CandidateGroupCard
                                                    key={groupId}
                                                    group={group}
                                                    onInvite={() => handleInviteGroup(group)}
                                                    isInvited={invitedGroups.includes(groupId)}
                                                />
                                            );
                                        })
                                    ) : (
                                        <div className="text-center p-6 bg-black/20 rounded-lg">
                                            <p className="text-white/80">No se han encontrado grupos de inquilinos compatibles por ahora.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </GlassCard>
            </div>
        )
    };

    const renderContent = () => {
        switch(view) {
            case 'dashboard': return renderDashboardView();
            case 'properties': return renderPropertiesView();
            case 'profile': return renderProfileView();
            case 'propertyDetail': return renderPropertyDetailView();
            default: return renderDashboardView();
        }
    };

    return (
        <div className="h-full w-full flex flex-col">
            <TopNavBar activeView={view} setView={setView} onAddNew={handleAddNew} />
            <main className="flex-1 overflow-y-auto">
                 <div className="p-6 md:pb-6 pb-24">
                    {renderContent()}
                </div>
            </main>
            <AddPropertyModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveAndClose}
                propertyToEdit={propertyToEdit}
                initialData={propertyToEdit ? null : initialPropertyData}
            />
            <BottomNavBar activeView={view} setView={setView} onAddNew={handleAddNew} />
        </div>
    );
};

export default OwnerDashboard;