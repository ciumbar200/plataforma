import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
export default function TenantBrowse() {
    const [list, setList] = useState([]);
    useEffect(() => { load(); }, []);
    async function load() {
        const { data } = await api.get("/matches/roommates/suggestions");
        setList(data.suggestions || []);
    }
    async function connect(id) {
        await api.post(`/matches/roommates/like/${id}`);
        setList(list.filter(x => x.user.id !== id));
    }
    async function skip(id) {
        await api.post(`/matches/roommates/skip/${id}`);
        setList(list.filter(x => x.user.id !== id));
    }
    return (_jsx("div", { className: "min-h-screen p-6", style: {
            background: `
        radial-gradient(1200px 800px at 20% -10%, rgba(124,58,237,.35), transparent 60%),
        radial-gradient(1200px 800px at 120% 110%, rgba(34,211,238,.25), transparent 60%),
        linear-gradient(160deg, #0f172a, #1e293b)
      `
        }, children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs("div", { className: "glass-card bg-white/7 backdrop-blur-lg border border-white/12 rounded-2xl p-8 relative overflow-hidden mb-6", children: [_jsx("div", { className: "absolute -top-2 -right-2 w-56 h-56 pointer-events-none", style: {
                                background: 'radial-gradient(closest-side, rgba(124,58,237,.3), transparent 70%)',
                                filter: 'blur(16px)',
                                transform: 'translate(18%, -18%)'
                            } }), _jsx("div", { className: "badge inline-flex items-center gap-2 text-xs text-white bg-purple-500/25 border border-purple-500/50 px-3 py-1.5 rounded-full mb-4", children: "MoOn \u2022 Compa\u00F1eros" }), _jsx("h2", { className: "text-3xl font-semibold text-white mb-2 tracking-wide", children: "Buscar compa\u00F1ero" }), _jsx("p", { className: "text-gray-400 text-sm mb-8", children: "Encuentra tu compa\u00F1ero de piso ideal con nuestro algoritmo de matching" })] }), _jsx("div", { className: "grid gap-6", children: list.map(({ user, score }) => (_jsx("div", { className: "glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-6 items-center", children: [_jsx("img", { src: user.image || "https://via.placeholder.com/120", className: "w-24 h-24 md:w-28 md:h-28 object-cover rounded-2xl border-2 border-white/20 mx-auto md:mx-0", alt: user.name || user.email }), _jsxs("div", { className: "text-center md:text-left", children: [_jsx("div", { className: "text-lg font-semibold text-white mb-1", children: user.name || user.email }), _jsxs("div", { className: "inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1 mb-2", children: [_jsx("span", { className: "w-2 h-2 bg-green-400 rounded-full" }), _jsxs("span", { className: "text-green-300 text-sm font-medium", children: ["Match: ", score, "%"] })] }), _jsxs("div", { className: "text-gray-300 mb-2", children: ["\uD83D\uDCCD ", user.city] }), _jsx("div", { className: "text-xs text-gray-400 flex flex-wrap gap-1", children: (user.tags || []).slice(0, 6).map((tag, i) => (_jsx("span", { className: "bg-white/10 px-2 py-1 rounded-full", children: tag }, i))) })] }), _jsxs("div", { className: "flex flex-col gap-3 w-full md:w-auto", children: [_jsx("button", { onClick: () => connect(user.id), className: "px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1", children: "\uD83D\uDC9C Conectar" }), _jsx("button", { onClick: () => skip(user.id), className: "px-6 py-3 bg-white/10 border border-white/20 text-gray-300 font-medium rounded-xl hover:bg-white/20 transition-all", children: "\u23ED\uFE0F Saltar" })] })] }) }, user.id))) })] }) }));
}
