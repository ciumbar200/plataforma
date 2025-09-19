import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// FIX: Removed import for MOCK_OWNER_STATS which does not exist in constants.ts.
import StatCard from './components/StatCard';
import { BuildingIcon, ChartBarIcon, EyeIcon, UsersIcon, UserCircleIcon, PlusIcon } from '../components/icons';
import PropertyCard from './components/PropertyCard';
import AddPropertyModal from './components/AddPropertyModal';
// FIX: Added OwnerStats to import to use for the mock data type.
import { Property, User, PropertyType, OwnerStats } from '../types';
import GlassCard from '../components/GlassCard';

// FIX: Added MOCK_OWNER_STATS constant locally as it was missing from the imported file.
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

type InitialPropertyData = { propertyType: PropertyType; city: string; locality: string };

interface OwnerDashboardProps {
    user: User;
    properties: Property[];
    // FIX: Excluded 'owner_id' from the prop type to match the expected data structure from child components.
    onSaveProperty: (propertyData: Omit<Property, 'id' | 'views' | 'compatibleCandidates' | 'owner_id'> & { id?: number }) => void;
    initialPropertyData: InitialPropertyData | null;
    onClearInitialPropertyData: () => void;
}

const navItems = [
    { id: 'dashboard', icon: <ChartBarIcon className="w-7 h-7" />, label: 'Panel' },
    { id: 'properties', icon: <BuildingIcon className="w-7 h-7" />, label: 'Propiedades' },
    { id: 'profile', icon: <UserCircleIcon className="w-7 h-7" />, label: 'Mi Perfil' },
] as const;

type View = typeof navItems[number]['id'];

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

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ user, properties, onSaveProperty, initialPropertyData, onClearInitialPropertyData }) => {
    const [view, setView] = useState<View>('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);

    useEffect(() => {
        if (initialPropertyData) {
            setPropertyToEdit(null); // Ensure we are not editing
            setIsModalOpen(true);
            onClearInitialPropertyData(); // Clear data after using it
        }
    }, [initialPropertyData, onClearInitialPropertyData]);

    const handleAddNew = () => {
        setPropertyToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (property: Property) => {
        setPropertyToEdit(property);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPropertyToEdit(null);
    };

    // FIX: Updated parameter type to exclude 'owner_id' to align with child component and parent handler.
    const handleSaveAndClose = (propertyData: Omit<Property, 'id' | 'views' | 'compatibleCandidates' | 'owner_id'> & { id?: number }) => {
        onSaveProperty(propertyData);
        handleCloseModal();
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
                    value={properties.reduce((acc, p) => acc + p.compatibleCandidates, 0).toLocaleString()}
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
                        <PropertyCard key={prop.id} property={prop} onEdit={handleEdit} />
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
                        <img src={user.profilePicture} alt={user.name} className="w-40 h-40 rounded-full object-cover border-4 border-purple-400 shadow-lg" />
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

    const renderContent = () => {
        switch(view) {
            case 'dashboard': return renderDashboardView();
            case 'properties': return renderPropertiesView();
            case 'profile': return renderProfileView();
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