import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../auth/AuthContext";

export default function Account() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState<any>({ name: "", image: "", videoUrl: "", city: "", noiseLevel: 3, maxDistanceKm: 10, about: "", tagsInput: "" });

  useEffect(()=>{
    if (user) setForm({
      name: user.name || "",
      image: user.image || "",
      videoUrl: (user as any).videoUrl || "",
      city: (user as any).city || "",
      noiseLevel: (user as any).noiseLevel || 3,
      maxDistanceKm: (user as any).maxDistanceKm || 10,
      about: (user as any).about || "",
      tagsInput: ((user as any).tags || []).join(", ")
    });
  }, [user]);

  async function save() {
    const tags = form.tagsInput.split(",").map((t:string)=>t.trim()).filter(Boolean);
    await api.patch("/users/me", { name: form.name, image: form.image, videoUrl: form.videoUrl, city: form.city, noiseLevel: Number(form.noiseLevel), maxDistanceKm: Number(form.maxDistanceKm), about: form.about, tags });
    await refresh();
    alert("Guardado");
  }

  return (
    <div className="min-h-screen p-6" style={{
      background: `
        radial-gradient(1200px 800px at 20% -10%, rgba(124,58,237,.35), transparent 60%),
        radial-gradient(1200px 800px at 120% 110%, rgba(34,211,238,.25), transparent 60%),
        linear-gradient(160deg, #0f172a, #1e293b)
      `
    }}>
      <div className="max-w-2xl mx-auto">
        <div className="glass-card bg-white/7 backdrop-blur-lg border border-white/12 rounded-2xl p-8 relative overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute -top-2 -right-2 w-56 h-56 pointer-events-none" style={{
            background: 'radial-gradient(closest-side, rgba(124,58,237,.3), transparent 70%)',
            filter: 'blur(16px)',
            transform: 'translate(18%, -18%)'
          }}></div>
          
          <div className="badge inline-flex items-center gap-2 text-xs text-white bg-purple-500/25 border border-purple-500/50 px-3 py-1.5 rounded-full mb-4">
            MoOn • Perfil
          </div>
          
          <h2 className="text-3xl font-semibold text-white mb-2 tracking-wide">Mi Cuenta</h2>
          <p className="text-gray-400 text-sm mb-8">Completa tu perfil para mejorar tus matches</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="field">
              <label className="block text-xs text-gray-400 mb-2">Nombre completo *</label>
              <input 
                value={form.name} 
                onChange={e=>setForm({...form, name: e.target.value})}
                className="w-full p-3 rounded-xl bg-white/8 border border-white/16 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
                placeholder="Tu nombre completo"
              />
            </div>
            
            <div className="field">
              <label className="block text-xs text-gray-400 mb-2">Ciudad *</label>
              <input 
                value={form.city} 
                onChange={e=>setForm({...form, city: e.target.value})}
                className="w-full p-3 rounded-xl bg-white/8 border border-white/16 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
                placeholder="Barcelona, Madrid, Valencia..."
              />
            </div>
            
            <div className="field md:col-span-2">
              <label className="block text-xs text-gray-400 mb-2">Foto de perfil (URL) *</label>
              <input 
                value={form.image} 
                onChange={e=>setForm({...form, image: e.target.value})}
                className="w-full p-3 rounded-xl bg-white/8 border border-white/16 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
                placeholder="https://ejemplo.com/mi-foto.jpg"
              />
              <span className="text-xs text-gray-500 mt-1 block">Una foto clara de tu rostro ayuda a generar confianza</span>
            </div>
            
            <div className="field md:col-span-2">
              <label className="block text-xs text-gray-400 mb-2">Vídeo de presentación (URL) *</label>
              <input 
                value={form.videoUrl} 
                onChange={e=>setForm({...form, videoUrl: e.target.value})}
                className="w-full p-3 rounded-xl bg-white/8 border border-white/16 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
                placeholder="https://ejemplo.com/mi-video.mp4"
              />
              <span className="text-xs text-gray-500 mt-1 block">Un vídeo corto te ayudará a destacar entre otros candidatos</span>
            </div>
            
            <div className="field">
              <label className="block text-xs text-gray-400 mb-2">Nivel de ruido tolerado</label>
              <select 
                value={form.noiseLevel} 
                onChange={e=>setForm({...form, noiseLevel: e.target.value})}
                className="w-full p-3 rounded-xl bg-white/8 border border-white/16 text-white outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
              >
                <option value={1}>1 - Muy silencioso</option>
                <option value={2}>2 - Silencioso</option>
                <option value={3}>3 - Moderado</option>
                <option value={4}>4 - Ruidoso</option>
                <option value={5}>5 - Muy ruidoso</option>
              </select>
            </div>
            
            <div className="field">
              <label className="block text-xs text-gray-400 mb-2">Distancia máxima (km)</label>
              <input 
                type="number" 
                min={0} 
                max={200} 
                value={form.maxDistanceKm} 
                onChange={e=>setForm({...form, maxDistanceKm: e.target.value})}
                className="w-full p-3 rounded-xl bg-white/8 border border-white/16 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
                placeholder="10"
              />
            </div>
            
            <div className="field md:col-span-2">
              <label className="block text-xs text-gray-400 mb-2">Sobre mí</label>
              <textarea 
                value={form.about} 
                onChange={e=>setForm({...form, about: e.target.value})}
                rows={4}
                className="w-full p-3 rounded-xl bg-white/8 border border-white/16 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12 resize-none"
                placeholder="Cuéntanos sobre ti, tus hobbies, estilo de vida..."
              />
            </div>
            
            <div className="field md:col-span-2">
              <label className="block text-xs text-gray-400 mb-2">Intereses y hobbies</label>
              <input 
                value={form.tagsInput} 
                onChange={e=>setForm({...form, tagsInput: e.target.value})}
                className="w-full p-3 rounded-xl bg-white/8 border border-white/16 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
                placeholder="música, deportes, cocina, lectura..."
              />
              <span className="text-xs text-gray-500 mt-1 block">Separa cada interés con una coma</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button 
              onClick={save}
              className="btn flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 hover:brightness-105 hover:shadow-[0_10px_26px_rgba(124,58,237,.45)] active:translate-y-px" 
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #22d3ee)',
                boxShadow: '0 8px 22px rgba(124,58,237,.35)'
              }}
            >
              Guardar Cambios
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Plan actual:</span>
              <span className="text-white font-semibold">{user?.plan || 'Standard'}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-400">Rol:</span>
              <span className="text-white font-semibold">{user?.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
