import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function OwnerProperties() {
  const [props, setProps] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ title:"", description:"", city:"", priceMonthly:0, photos:"", visibility:"PUBLIC" });

  async function load() {
    const { data } = await api.get("/properties/mine"); setProps(data.properties || []);
  }
  useEffect(()=>{ load(); }, []);

  async function create() {
    const payload = { ...form, priceMonthly: Number(form.priceMonthly), photos: form.photos.split(",").map((x:string)=>x.trim()).filter(Boolean) };
    await api.post("/properties", payload);
    setForm({ title:"", description:"", city:"", priceMonthly:0, photos:"", visibility:"PUBLIC" });
    await load();
  }
  async function toggleVisibility(p:any) {
    const newV = p.visibility==="PUBLIC" ? "MATCHED_ONLY" : "PUBLIC";
    await api.patch(`/properties/${p.id}`, { visibility: newV });
    await load();
  }
  return (
    <div className="min-h-screen p-6" style={{
      background: `
        radial-gradient(1200px 800px at 20% -10%, rgba(124,58,237,.35), transparent 60%),
        radial-gradient(1200px 800px at 120% 110%, rgba(34,211,238,.25), transparent 60%),
        linear-gradient(160deg, #0f172a, #1e293b)
      `
    }}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Nueva Propiedad */}
        <div className="glass-card bg-white/7 backdrop-blur-lg border border-white/12 rounded-2xl p-8 relative overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute -top-2 -right-2 w-56 h-56 pointer-events-none" style={{
            background: 'radial-gradient(closest-side, rgba(124,58,237,.3), transparent 70%)',
            filter: 'blur(16px)',
            transform: 'translate(18%, -18%)'
          }}></div>
          
          <div className="badge inline-flex items-center gap-2 text-xs text-white bg-purple-500/25 border border-purple-500/50 px-3 py-1.5 rounded-full mb-4">
            MoOn • Nueva Propiedad
          </div>
          
          <h2 className="text-3xl font-semibold text-white mb-2 tracking-wide">Agregar nueva propiedad</h2>
          <p className="text-gray-400 text-sm mb-8">Completa los detalles de tu propiedad para atraer inquilinos</p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <div className="field">
              <label className="block text-xs text-gray-400 mb-2">Título *</label>
              <input 
                placeholder="Ej: Apartamento moderno en el centro" 
                value={form.title} 
                onChange={e=>setForm({...form, title: e.target.value})}
                className="w-full p-3 rounded-xl bg-white/8 border border-white/16 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
              />
            </div>
            
            <div className="field">
              <label className="block text-xs text-gray-400 mb-2">Ciudad *</label>
              <input 
                placeholder="Ej: Barcelona" 
                value={form.city} 
                onChange={e=>setForm({...form, city: e.target.value})}
                className="w-full p-3 rounded-xl bg-white/8 border border-white/16 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
              />
            </div>
            
            <div className="field">
              <label className="block text-xs text-gray-400 mb-2">Precio mensual *</label>
              <input 
                type="number" 
                placeholder="800" 
                value={form.priceMonthly} 
                onChange={e=>setForm({...form, priceMonthly: e.target.value})}
                className="w-full p-3 rounded-xl bg-white/8 border border-white/16 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
              />
            </div>
            
            <div className="field">
              <label className="block text-xs text-gray-400 mb-2">Visibilidad *</label>
              <select 
                value={form.visibility} 
                onChange={e=>setForm({...form, visibility: e.target.value})}
                className="w-full p-3 rounded-xl bg-white/8 border border-white/16 text-white outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
              >
                <option value="PUBLIC">🌍 Pública (todos los inquilinos)</option>
                <option value="MATCHED_ONLY">🔒 Privada (solo con match)</option>
              </select>
            </div>
            
            <div className="field md:col-span-2">
              <label className="block text-xs text-gray-400 mb-2">Descripción *</label>
              <textarea 
                placeholder="Describe tu propiedad, servicios incluidos, ubicación..." 
                value={form.description} 
                onChange={e=>setForm({...form, description: e.target.value})}
                rows={4}
                className="w-full p-3 rounded-xl bg-white/8 border border-white/16 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12 resize-none"
              />
            </div>
            
            <div className="field md:col-span-2">
              <label className="block text-xs text-gray-400 mb-2">Fotos (URLs separadas por coma)</label>
              <input 
                placeholder="https://ejemplo.com/foto1.jpg, https://ejemplo.com/foto2.jpg" 
                value={form.photos} 
                onChange={e=>setForm({...form, photos: e.target.value})}
                className="w-full p-3 rounded-xl bg-white/8 border border-white/16 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
              />
            </div>
            
            <div className="md:col-span-2 flex justify-end">
              <button 
                onClick={create}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                ✨ Crear propiedad
              </button>
            </div>
          </div>
        </div>

        {/* Mis Propiedades */}
        <div className="glass-card bg-white/7 backdrop-blur-lg border border-white/12 rounded-2xl p-8 relative overflow-hidden">
          <div className="badge inline-flex items-center gap-2 text-xs text-white bg-purple-500/25 border border-purple-500/50 px-3 py-1.5 rounded-full mb-4">
            MoOn • Mis Propiedades
          </div>
          
          <h2 className="text-3xl font-semibold text-white mb-2 tracking-wide">Mis propiedades</h2>
          <p className="text-gray-400 text-sm mb-8">Gestiona y controla la visibilidad de tus propiedades</p>
          
          <div className="grid gap-6">
            {props.map((p:any)=>(
              <div key={p.id} className="glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all">
                <div className="grid md:grid-cols-[300px_1fr_auto] gap-6 items-start">
                  <div className="flex gap-3 overflow-x-auto">
                    {(p.photos||[]).map((ph:string,i:number)=>(
                      <img 
                        key={i} 
                        src={ph} 
                        className="w-20 h-20 object-cover rounded-xl border border-white/20 flex-shrink-0" 
                        alt={`Foto ${i+1}`}
                      />
                    ))}
                  </div>
                  
                  <div>
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{p.title}</h3>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{p.priceMonthly} €</div>
                        <div className="text-xs text-gray-400">/mes</div>
                      </div>
                    </div>
                    
                    <div className="inline-flex items-center gap-2 mb-3">
                      {p.visibility === "PUBLIC" ? (
                        <span className="bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1 text-green-300 text-xs font-medium">
                          🌍 Pública
                        </span>
                      ) : (
                        <span className="bg-orange-500/20 border border-orange-500/30 rounded-full px-3 py-1 text-orange-300 text-xs font-medium">
                          🔒 Privada
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-300 text-sm">{p.description}</p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={()=>toggleVisibility(p)}
                      className="px-4 py-2 bg-white/10 border border-white/20 text-gray-300 font-medium rounded-xl hover:bg-white/20 transition-all text-sm"
                    >
                      {p.visibility==="PUBLIC"?"🔒 Hacer privada":"🌍 Hacer pública"}
                    </button>
                    <a 
                      href={`/owner/properties/${p.id}/candidates`} 
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1 text-center text-sm"
                    >
                      👥 Ver candidatos
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
