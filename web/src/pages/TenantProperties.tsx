import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function TenantProperties() {
  const [props, setProps] = useState<any[]>([]);
  useEffect(()=>{ load(); }, []);
  async function load() {
    const { data } = await api.get("/properties");
    setProps(data.properties || []);
  }
  async function interest(id: string) {
    await api.post(`/matches/properties/${id}/interest`);
    alert("Interés enviado al propietario");
  }
  return (
    <div className="min-h-screen p-6" style={{
      background: `
        radial-gradient(1200px 800px at 20% -10%, rgba(124,58,237,.35), transparent 60%),
        radial-gradient(1200px 800px at 120% 110%, rgba(34,211,238,.25), transparent 60%),
        linear-gradient(160deg, #0f172a, #1e293b)
      `
    }}>
      <div className="max-w-6xl mx-auto">
        <div className="glass-card bg-white/7 backdrop-blur-lg border border-white/12 rounded-2xl p-8 relative overflow-hidden mb-6">
          {/* Decorative gradient */}
          <div className="absolute -top-2 -right-2 w-56 h-56 pointer-events-none" style={{
            background: 'radial-gradient(closest-side, rgba(124,58,237,.3), transparent 70%)',
            filter: 'blur(16px)',
            transform: 'translate(18%, -18%)'
          }}></div>
          
          <div className="badge inline-flex items-center gap-2 text-xs text-white bg-purple-500/25 border border-purple-500/50 px-3 py-1.5 rounded-full mb-4">
            MoOn • Propiedades
          </div>
          
          <h2 className="text-3xl font-semibold text-white mb-2 tracking-wide">Propiedades disponibles</h2>
          <p className="text-gray-400 text-sm mb-8">Explora las mejores propiedades y encuentra tu hogar ideal</p>
        </div>

        <div className="grid gap-6">
          {props.map((p:any)=>(
            <div key={p.id} className="glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all">
              <div className="grid md:grid-cols-[300px_1fr] gap-6">
                <div className="flex gap-3 overflow-x-auto">
                  {(p.photos||[]).slice(0,3).map((ph:string, i:number)=>(
                    <img 
                      key={i} 
                      src={ph} 
                      className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl border border-white/20 flex-shrink-0" 
                      alt={`Propiedad ${i+1}`}
                    />
                  ))}
                </div>
                
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-white">{p.title}</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{p.priceMonthly} €</div>
                        <div className="text-sm text-gray-400">/mes</div>
                      </div>
                    </div>
                    
                    {p.visibility==="MATCHED_ONLY" && (
                      <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-3 py-1 mb-3">
                        <span className="text-orange-300 text-xs font-medium">🔒 Privada — requiere match</span>
                      </div>
                    )}
                    
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{p.description}</p>
                    
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                      <span>📍</span>
                      <span>{p.city}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={()=>interest(p.id)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1 w-full md:w-auto"
                  >
                    💜 Me interesa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
