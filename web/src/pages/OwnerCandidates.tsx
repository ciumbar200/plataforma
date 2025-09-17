import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useParams } from "react-router-dom";

export default function OwnerCandidates() {
  const { id } = useParams();
  const [cands, setCands] = useState<any[]>([]);
  useEffect(()=>{ load(); }, [id]);
  async function load() {
    const { data } = await api.get(`/matches/owner/properties/${id}/candidates`);
    setCands(data.candidates || []);
  }
  async function decide(cid: string, status: "ACCEPTED"|"REJECTED") {
    await api.patch(`/matches/property-matches/${cid}`, { status });
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
      <div className="max-w-4xl mx-auto">
        <div className="glass-card bg-white/7 backdrop-blur-lg border border-white/12 rounded-2xl p-8 relative overflow-hidden mb-6">
          {/* Decorative gradient */}
          <div className="absolute -top-2 -right-2 w-56 h-56 pointer-events-none" style={{
            background: 'radial-gradient(closest-side, rgba(124,58,237,.3), transparent 70%)',
            filter: 'blur(16px)',
            transform: 'translate(18%, -18%)'
          }}></div>
          
          <div className="badge inline-flex items-center gap-2 text-xs text-white bg-purple-500/25 border border-purple-500/50 px-3 py-1.5 rounded-full mb-4">
            MoOn • Candidatos
          </div>
          
          <h2 className="text-3xl font-semibold text-white mb-2 tracking-wide">Candidatos para tu propiedad</h2>
          <p className="text-gray-400 text-sm mb-8">Revisa y gestiona las solicitudes de inquilinos interesados</p>
        </div>

        <div className="space-y-4">
          {cands.length === 0 ? (
            <div className="glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No hay candidatos aún</h3>
              <p className="text-gray-400">Los inquilinos interesados aparecerán aquí cuando se registren</p>
            </div>
          ) : (
            cands.map((c:any)=>(
              <div key={c.id} className="glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <img 
                    src={c.tenant.image || "https://via.placeholder.com/64"} 
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20"
                    alt={c.tenant.name || c.tenant.email}
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{c.tenant.name || c.tenant.email}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        c.status === 'ACCEPTED' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                        c.status === 'REJECTED' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                        'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      }`}>
                        {c.status === 'ACCEPTED' ? '✅ Aceptado' : c.status === 'REJECTED' ? '❌ Rechazado' : '⏳ Pendiente'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <span>⭐</span>
                        <span>Score: <span className="font-semibold text-white">{c.score}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{c.tenant.city}</span>
                      </div>
                    </div>
                    
                    {c.tenant.tags && c.tenant.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {c.tenant.tags.slice(0,6).map((tag: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-white/10 border border-white/20 rounded-lg text-xs text-gray-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {c.status === 'PENDING' && (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={()=>decide(c.id, "ACCEPTED")}
                        className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                      >
                        ✅ Aceptar
                      </button>
                      <button 
                        onClick={()=>decide(c.id, "REJECTED")}
                        className="px-6 py-2 bg-white/10 border border-white/20 text-gray-300 font-medium rounded-xl hover:bg-white/20 transition-all"
                      >
                        ❌ Rechazar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
