import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
export default function OwnerDashboard() {
    const [stats, setStats] = useState({ total: 0, aceptados: 0, ingresos: 0 });
    useEffect(() => { load(); }, []);
    async function load() {
        const { data } = await api.get("/properties/mine");
        const props = data.properties || [];
        let aceptados = 0;
        for (const p of props) {
            const cand = await api.get(`/matches/owner/properties/${p.id}/candidates`);
            aceptados += (cand.data.candidates || []).filter((c) => c.status === "ACCEPTED").length;
        }
        const ingresos = props.reduce((acc, p) => acc + (p.priceMonthly || 0), 0);
        setStats({ total: props.length, aceptados, ingresos });
    }
    return (_jsx("div", { className: "min-h-screen p-6", style: {
            background: `
        radial-gradient(1200px 800px at 20% -10%, rgba(124,58,237,.35), transparent 60%),
        radial-gradient(1200px 800px at 120% 110%, rgba(34,211,238,.25), transparent 60%),
        linear-gradient(160deg, #0f172a, #1e293b)
      `
        }, children: _jsx("div", { className: "max-w-6xl mx-auto", children: _jsxs("div", { className: "glass-card bg-white/7 backdrop-blur-lg border border-white/12 rounded-2xl p-8 relative overflow-hidden", children: [_jsx("div", { className: "absolute -top-2 -right-2 w-56 h-56 pointer-events-none", style: {
                            background: 'radial-gradient(closest-side, rgba(124,58,237,.3), transparent 70%)',
                            filter: 'blur(16px)',
                            transform: 'translate(18%, -18%)'
                        } }), _jsx("div", { className: "badge inline-flex items-center gap-2 text-xs text-white bg-purple-500/25 border border-purple-500/50 px-3 py-1.5 rounded-full mb-4", children: "MoOn \u2022 Propietario" }), _jsx("h2", { className: "text-3xl font-semibold text-white mb-2 tracking-wide", children: "Panel de Propietario" }), _jsx("p", { className: "text-gray-400 text-sm mb-8", children: "Gestiona tus propiedades y revisa el rendimiento" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx(Stat, { title: "Propiedades", value: stats.total, icon: "\uD83C\uDFE0" }), _jsx(Stat, { title: "Matches aceptados", value: stats.aceptados, icon: "\u2705" }), _jsx(Stat, { title: "Ganancias estimadas", value: stats.ingresos + " €/mes", icon: "\uD83D\uDCB0" })] })] }) }) }));
}
function Stat({ title, value, icon }) {
    return (_jsxs("div", { className: "glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-all", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("span", { className: "text-2xl", children: icon }), _jsx("div", { className: "text-right", children: _jsx("div", { className: "text-2xl font-bold text-white", children: value }) })] }), _jsx("div", { className: "text-sm text-gray-400", children: title })] }));
}
