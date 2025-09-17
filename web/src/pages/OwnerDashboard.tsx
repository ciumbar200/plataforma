import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function OwnerDashboard() {
  const [stats, setStats] = useState<any>({ total: 0, aceptados: 0, ingresos: 0 });
  useEffect(()=>{ load(); }, []);
  async function load() {
    const { data } = await api.get("/properties/mine");
    const props = data.properties || [];
    let aceptados = 0;
    for (const p of props) {
      const cand = await api.get(`/matches/owner/properties/${p.id}/candidates`);
      aceptados += (cand.data.candidates || []).filter((c:any)=>c.status==="ACCEPTED").length;
    }
    const ingresos = props.reduce((acc:any,p:any)=>acc + (p.priceMonthly||0), 0);
    setStats({ total: props.length, aceptados, ingresos });
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
        <div className="glass-card bg-white/7 backdrop-blur-lg border border-white/12 rounded-2xl p-8 relative overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute -top-2 -right-2 w-56 h-56 pointer-events-none" style={{
            background: 'radial-gradient(closest-side, rgba(124,58,237,.3), transparent 70%)',
            filter: 'blur(16px)',
            transform: 'translate(18%, -18%)'
          }}></div>
          
          <div className="badge inline-flex items-center gap-2 text-xs text-white bg-purple-500/25 border border-purple-500/50 px-3 py-1.5 rounded-full mb-4">
            MoOn • Propietario
          </div>
          
          <h2 className="text-3xl font-semibold text-white mb-2 tracking-wide">Panel de Propietario</h2>
          <p className="text-gray-400 text-sm mb-8">Gestiona tus propiedades y revisa el rendimiento</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Stat title="Propiedades" value={stats.total} icon="🏠" />
            <Stat title="Matches aceptados" value={stats.aceptados} icon="✅" />
            <Stat title="Ganancias estimadas" value={stats.ingresos + " €/mes"} icon="💰" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value, icon }: any) {
  return (
    <div className="glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{value}</div>
        </div>
      </div>
      <div className="text-sm text-gray-400">{title}</div>
    </div>
  );
}
