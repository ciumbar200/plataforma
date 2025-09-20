import React, { useState, useRef } from 'react';
import { User, RentalGoal } from '../../types';
import GlassCard from '../../components/GlassCard';
import { CITIES_DATA } from '../../constants';
import { CameraIcon } from '../../components/icons';
import { supabase } from '../../lib/supabaseClient';

interface ProfileProps {
  user: User;
  onSave: (updatedUser: User) => void;
}

const ALL_INTERESTS = ['Yoga', 'Cocina Vegana', 'Viajar', 'Fotografía', 'Senderismo', 'Música Indie', 'Música en vivo', 'Cine', 'Salir de tapas', 'Arte Urbano', 'Videojuegos', 'Lectura', 'Teatro', 'Museos', 'Brunch', 'Deportes', 'Series', 'Fitness', 'Cocinar'];
const ALL_LIFESTYLES = ['Diurno', 'Nocturno', 'Deportista', 'Creativo', 'Social', 'Intelectual', 'Eco-friendly', 'Tranquilo'];

const Profile: React.FC<ProfileProps> = ({ user, onSave }) => {
  const [formData, setFormData] = useState(user);
  const [localities, setLocalities] = useState<string[]>(CITIES_DATA[user.city || 'Madrid'] || []);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      // Create a temporary URL for instant preview
      setFormData(prev => ({ ...prev, profile_picture: URL.createObjectURL(file) }));
    }
  };
  
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    const newLocalities = CITIES_DATA[city] || [];
    setLocalities(newLocalities);
    setFormData(prev => ({ ...prev, city, locality: newLocalities[0] || '' }));
  };

  const handleInterestToggle = (interest: string) => {
    const currentInterests = formData.interests || [];
    const interests = currentInterests.includes(interest)
      ? currentInterests.filter(i => i !== interest)
      : [...currentInterests, interest];
    setFormData(prev => ({ ...prev, interests }));
  };
  
  const handleLifestyleToggle = (style: string) => {
    const currentLifestyle = formData.lifestyle || [];
    const lifestyle = currentLifestyle.includes(style)
      ? currentLifestyle.filter(s => s !== style)
      : [...currentLifestyle, style];
    setFormData(prev => ({ ...prev, lifestyle }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    let finalUserData = { ...formData };

    if (profileImageFile) {
        const fileExt = profileImageFile.name.split('.').pop();
        // Use a simple, robust path. user.id is unique. Appending timestamp prevents caching issues.
        const filePath = `${user.id}-${new Date().getTime()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, profileImageFile, {
                cacheControl: '3600',
                upsert: true, // Overwrite if file with same name exists
            });

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            alert('Hubo un error al subir la nueva imagen de perfil.');
            // Revert preview to original image on failure
            setFormData(prev => ({ ...prev, profile_picture: user.profile_picture }));
            setIsUploading(false);
            return;
        }

        // Get public URL of the uploaded file
        const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);
        
        // Update the profile picture with the permanent URL
        finalUserData.profile_picture = urlData.publicUrl;
    }

    // Call the parent onSave function with the updated user data
    onSave(finalUserData);
    setIsUploading(false);
  };

  return (
    <GlassCard>
      <h2 className="text-2xl font-bold mb-6">Editar Perfil</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center">
            <div className="relative">
                <img src={formData.profile_picture} alt="Foto de perfil" className="w-40 h-40 rounded-full object-cover border-4 border-indigo-400" />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleProfilePictureChange} 
                  className="hidden" 
                  accept="image/*" 
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-slate-800/80 backdrop-blur-sm rounded-full p-3 text-white hover:bg-slate-700/80 transition-colors"
                  aria-label="Cambiar foto de perfil"
                >
                  <CameraIcon className="w-5 h-5" />
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">Nombre</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-white/80 mb-1">Edad</label>
            <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-white/80 mb-1">Biografía</label>
          <textarea name="bio" id="bio" value={formData.bio || ''} onChange={handleChange} rows={4} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-white/80 mb-1">Ciudad</label>
              <select name="city" id="city" value={formData.city} onChange={handleCityChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500">
                  {Object.keys(CITIES_DATA).map(city => <option key={city} value={city} className="bg-gray-800">{city}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="locality" className="block text-sm font-medium text-white/80 mb-1">Localidad</label>
              <select name="locality" id="locality" value={formData.locality} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500">
                  {localities.map(loc => <option key={loc} value={loc} className="bg-gray-800">{loc}</option>)}
              </select>
            </div>
        </div>
        
        {user.role === 'INQUILINO' && (
            <>
                <div>
                  <label htmlFor="video_url" className="block text-sm font-medium text-white/80 mb-1">
                    URL de Vídeo de Presentación (Opcional)
                  </label>
                  <input 
                    type="url" 
                    name="video_url" 
                    id="video_url" 
                    value={formData.video_url || ''} 
                    onChange={handleChange} 
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://... (máx. 20 segundos)"
                  />
                  <p className="text-xs text-white/60 mt-1">
                    Un vídeo corto aumenta tus posibilidades de encontrar un match.
                  </p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-white/90 mb-3">Intereses</h3>
                    <div className="flex flex-wrap gap-2">
                        {ALL_INTERESTS.map(interest => (
                            <button key={interest} type="button" onClick={() => handleInterestToggle(interest)} className={`px-3 py-1 text-sm rounded-full transition-colors border ${(formData.interests || []).includes(interest) ? 'bg-indigo-500 border-indigo-400 text-white font-semibold' : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'}`}>
                                {interest}
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold text-white/90 mb-3">Estilo de vida</h3>
                    <div className="flex flex-wrap gap-2">
                        {ALL_LIFESTYLES.map(style => (
                            <button key={style} type="button" onClick={() => handleLifestyleToggle(style)} className={`px-3 py-1 text-sm rounded-full transition-colors border ${(formData.lifestyle || []).includes(style) ? 'bg-purple-500 border-purple-400 text-white font-semibold' : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'}`}>
                                {style}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="noise_level" className="block text-sm font-medium text-white/80 mb-1">Nivel de ruido preferido</label>
                        <select name="noise_level" id="noise_level" value={formData.noise_level} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="Bajo" className="bg-gray-800">Bajo</option>
                            <option value="Medio" className="bg-gray-800">Medio</option>
                            <option value="Alto" className="bg-gray-800">Alto</option>
                        </select>
                    </div>
                    <div>
                      <label htmlFor="commute_distance" className="block text-sm font-medium text-white/80 mb-1">Distancia máx. de búsqueda (min)</label>
                      <input type="number" name="commute_distance" id="commute_distance" value={formData.commute_distance || ''} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                </div>
            </>
        )}

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isUploading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
            {isUploading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </GlassCard>
  );
};

export default Profile;