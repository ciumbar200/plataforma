
import React, { useState, useEffect } from 'react';
import GlassCard from '../../components/GlassCard';
import { XIcon, CameraIcon } from '../../components/icons';
// FIX: Corrected import path for types.ts to point to the file inside the /src directory.
import { Property, AmenityId, PropertyFeatures, PropertyType } from '../../src/types';
// FIX: Corrected import path for constants.ts to point to the file inside the /src directory.
import { CITIES_DATA } from '../../src/constants';
// FIX: Corrected import path for icons.tsx.
import { AVAILABLE_AMENITIES } from '../../components/icons';

type InitialPropertyData = { property_type: PropertyType; city: string; locality: string };

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  // FIX: Excluded owner_id from the type as it is handled by the parent component, resolving a type mismatch error on save.
  onSave: (property: Omit<Property, 'id' | 'views' | 'compatible_candidates' | 'owner_id'> & { id?: number }) => void;
  propertyToEdit?: Property | null;
  initialData?: InitialPropertyData | null;
}

const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose, onSave, propertyToEdit, initialData }) => {
  // FIX: Added 'status' to the initial state to ensure the formData object matches the expected type for 'onSave'.
  const [formData, setFormData] = useState({
    title: '',
    address: '', // Street address
    city: 'Madrid',
    locality: '',
    postal_code: '',
    property_type: PropertyType.FLAT,
    price: '',
    available_from: '',
    video_url: '',
    visibility: 'Pública' as 'Pública' | 'Privada',
    conditions: '',
    features: {} as PropertyFeatures,
    lat: 0,
    lng: 0,
    status: 'pending' as 'approved' | 'pending' | 'rejected',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [localities, setLocalities] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
        const resetData = (city: string, locality?: string) => {
            const cityLocalities = CITIES_DATA[city] || [];
            setLocalities(cityLocalities);
            return {
                city,
                locality: locality && cityLocalities.includes(locality) ? locality : cityLocalities[0] || ''
            };
        };

        if (propertyToEdit) {
            const { city, locality } = resetData(propertyToEdit.city || 'Madrid', propertyToEdit.locality);
            setFormData({
                ...propertyToEdit,
                price: propertyToEdit.price.toString(),
                video_url: propertyToEdit.video_url || '',
                conditions: propertyToEdit.conditions || '',
                features: propertyToEdit.features || {},
                postal_code: propertyToEdit.postal_code || '',
                city,
                locality,
            });
            setExistingImageUrls(propertyToEdit.image_urls || []);
        } else {
            const initialCity = initialData?.city || 'Madrid';
            const { city, locality } = resetData(initialCity, initialData?.locality);
            // FIX: Added 'status' field to the reset state to ensure new properties are correctly initialized as 'pending'.
            setFormData({
                title: '',
                address: '',
                property_type: initialData?.property_type || PropertyType.FLAT,
                price: '',
                available_from: '',
                video_url: '',
                visibility: 'Pública',
                conditions: '',
                features: {},
                lat: 40.416775,
                lng: -3.703790,
                postal_code: '',
                city,
                locality,
                status: 'pending',
            });
            setExistingImageUrls([]);
        }
        setImageFiles([]);
    }
  }, [propertyToEdit, isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value;
    const newLocalities = CITIES_DATA[newCity] || [];
    setLocalities(newLocalities);
    setFormData(prev => ({
      ...prev,
      city: newCity,
      locality: newLocalities[0] || '',
    }));
  };

  const handleFeatureToggle = (featureId: AmenityId) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [featureId]: !prev.features[featureId],
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setImageFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url: string) => {
    setExistingImageUrls(prev => prev.filter(imageUrl => imageUrl !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const fileToDataUrl = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const newImageUrls = await Promise.all(imageFiles.map(fileToDataUrl));
    const finalImageUrls = [...existingImageUrls, ...newImageUrls];

    onSave({
      ...formData,
      price: parseInt(formData.price, 10) || 0,
      id: propertyToEdit?.id,
      image_urls: finalImageUrls,
    } as any);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <GlassCard className="w-full max-w-2xl text-white relative !p-0">
        <div className="p-6 border-b border-white/10">
            <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            aria-label="Cerrar modal"
            >
            <XIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold">{propertyToEdit ? 'Editar Propiedad' : 'Añadir Nueva Propiedad'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[85vh] overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-white/80 mb-1">Título</label>
              <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" required />
            </div>
            <div>
              <label htmlFor="property_type" className="block text-sm font-medium text-white/80 mb-1">Tipo de Propiedad</label>
              <select name="property_type" id="property_type" value={formData.property_type} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none">
                  {/* FIX: Add explicit type annotation to fix 'unknown' key error. */}
                  {Object.values(PropertyType).map((type: PropertyType) => (
                      <option key={type} value={type} className="bg-gray-800">{type}</option>
                  ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-white/80 mb-1">Dirección (Calle y número)</label>
            <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" required />
          </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                  <label htmlFor="city" className="block text-sm font-medium text-white/80 mb-1">Ciudad</label>
                  <select name="city" id="city" value={formData.city} onChange={handleCityChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none">
                      {Object.keys(CITIES_DATA).map(city => <option key={city} value={city} className="bg-gray-800">{city}</option>)}
                  </select>
              </div>
               <div>
                  <label htmlFor="locality" className="block text-sm font-medium text-white/80 mb-1">Localidad</label>
                  <select name="locality" id="locality" value={formData.locality} onChange={handleChange} disabled={localities.length === 0} className="w-full bg-white/10 border border-white/20 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50">
                      {localities.map(loc => <option key={loc} value={loc} className="bg-gray-800">{loc}</option>)}
                  </select>
              </div>
              <div>
                <label htmlFor="postal_code" className="block text-sm font-medium text-white/80 mb-1">Código Postal</label>
                <input type="text" name="postal_code" id="postal_code" value={formData.postal_code} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
          </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-white/80 mb-1">Precio/mes</label>
                <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
              <div>
                <label htmlFor="available_from" className="block text-sm font-medium text-white/80 mb-1">Disponible desde</label>
                <input type="date" name="available_from" id="available_from" value={formData.available_from} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" required style={{ colorScheme: 'dark' }} />
              </div>
          </div>
           <div>
                <label htmlFor="visibility" className="block text-sm font-medium text-white/80 mb-1">Visibilidad</label>
                <select name="visibility" id="visibility" value={formData.visibility} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="Pública" className="bg-gray-800">Pública</option>
                    <option value="Privada" className="bg-gray-800">Privada</option>
                </select>
            </div>
          <div>
            <label htmlFor="conditions" className="block text-sm font-medium text-white/80 mb-1">Condiciones de Alquiler</label>
            <textarea name="conditions" id="conditions" value={formData.conditions} onChange={handleChange} rows={3} className="w-full bg-white/10 border border-white/20 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej: Estancia mínima 6 meses, no se permite fumar..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Servicios y Comodidades</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {AVAILABLE_AMENITIES.map(amenity => (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => handleFeatureToggle(amenity.id as AmenityId)}
                  className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border-2 transition-colors text-center ${
                    formData.features[amenity.id as AmenityId]
                      ? 'bg-indigo-500/30 border-indigo-400 text-white'
                      : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:border-white/30'
                  }`}
                >
                  {React.cloneElement(amenity.icon, { className: 'w-6 h-6' })}
                  <span className="text-xs font-semibold">{amenity.label}</span>
                </button>
              ))}
            </div>
          </div>
           <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Imágenes</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {existingImageUrls.map((url, index) => (
                      <div key={`existing-${index}`} className="relative group aspect-square">
                          <img src={url} alt={`Imagen existente ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                          <button type="button" onClick={() => removeExistingImage(url)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <XIcon className="w-4 h-4" />
                          </button>
                      </div>
                  ))}
                  {imageFiles.map((file, index) => (
                      <div key={`new-${index}`} className="relative group aspect-square">
                          <img src={URL.createObjectURL(file)} alt={`Nueva imagen ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                          <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <XIcon className="w-4 h-4" />
                          </button>
                      </div>
                  ))}
                  <label className="cursor-pointer flex items-center justify-center bg-white/10 border-2 border-dashed border-white/20 rounded-lg aspect-square text-white/70 hover:bg-white/20 hover:border-white/30 transition-colors">
                      <div className="text-center">
                          <CameraIcon className="w-8 h-8 mx-auto" />
                          <span className="text-xs mt-1 block">Añadir</span>
                      </div>
                      <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
              </div>
          </div>
          <div>
            <label htmlFor="video_url" className="block text-sm font-medium text-white/80 mb-1">URL del Vídeo (Opcional)</label>
            <input type="text" name="video_url" id="video_url" value={formData.video_url} onChange={handleChange} className="w-full bg-white/10 border border-white/20 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-black/20 backdrop-blur-sm -m-6 mt-4 p-6 border-t border-white/10">
            <button type="button" onClick={onClose} className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg font-semibold transition-colors">Cancelar</button>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-semibold transition-colors">Guardar Propiedad</button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default AddPropertyModal;