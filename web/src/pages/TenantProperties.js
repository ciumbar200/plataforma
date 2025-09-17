import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
export default function TenantProperties() {
    const [props, setProps] = useState([]);
    useEffect(() => { load(); }, []);
    async function load() {
        const { data } = await api.get("/properties");
        setProps(data.properties || []);
    }
    async function interest(id) {
        await api.post(`/matches/properties/${id}/interest`);
        alert("Interés enviado al propietario");
    }
    return (_jsx("div", { className: "min-h-screen p-6", style: {
            background: `
        radial-gradient(1200px 800px at 20% -10%, rgba(124,58,237,.35), transparent 60%),
        radial-gradient(1200px 800px at 120% 110%, rgba(34,211,238,.25), transparent 60%),
        linear-gradient(160deg, #0f172a, #1e293b)
      `
        }, children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs("div", { className: "glass-card bg-white/7 backdrop-blur-lg border border-white/12 rounded-2xl p-8 relative overflow-hidden mb-6", children: [_jsx("div", { className: "absolute -top-2 -right-2 w-56 h-56 pointer-events-none", style: {
                                background: 'radial-gradient(closest-side, rgba(124,58,237,.3), transparent 70%)',
                                filter: 'blur(16px)',
                                transform: 'translate(18%, -18%)'
                            } }), _jsx("div", { className: "badge inline-flex items-center gap-2 text-xs text-white bg-purple-500/25 border border-purple-500/50 px-3 py-1.5 rounded-full mb-4", children: "MoOn \u2022 Propiedades" }), _jsx("h2", { className: "text-3xl font-semibold text-white mb-2 tracking-wide", children: "Propiedades disponibles" }), _jsx("p", { className: "text-gray-400 text-sm mb-8", children: "Explora las mejores propiedades y encuentra tu hogar ideal" })] }), _jsx("div", { className: "grid gap-6", children: props.map((p) => (_jsx("div", { className: "glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all", children: _jsxs("div", { className: "grid md:grid-cols-[300px_1fr] gap-6", children: [_jsx("div", { className: "flex gap-3 overflow-x-auto", children: (p.photos || []).slice(0, 3).map((ph, i) => (_jsx("img", { src: ph, className: "w-24 h-24 md:w-28 md:h-28 object-cover rounded-xl border border-white/20 flex-shrink-0", alt: `Propiedad ${i + 1}` }, i))) }), _jsxs("div", { className: "flex flex-col justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsx("h3", { className: "text-xl font-semibold text-white", children: p.title }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-2xl font-bold text-white", children: [p.priceMonthly, " \u20AC"] }), _jsx("div", { className: "text-sm text-gray-400", children: "/mes" })] })] }), p.visibility === "MATCHED_ONLY" && (_jsx("div", { className: "inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-3 py-1 mb-3", children: _jsx("span", { className: "text-orange-300 text-xs font-medium", children: "\uD83D\uDD12 Privada \u2014 requiere match" }) })), _jsx("p", { className: "text-gray-300 text-sm mb-4 line-clamp-2", children: p.description }), _jsxs("div", { className: "flex items-center gap-2 text-gray-400 text-sm mb-4", children: [_jsx("span", { children: "\uD83D\uDCCD" }), _jsx("span", { children: p.city })] })] }), _jsx("button", { onClick: () => interest(p.id), className: "px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1 w-full md:w-auto", children: "\uD83D\uDC9C Me interesa" })] })] }) }, p.id))) })] }) }));
}
