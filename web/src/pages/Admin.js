import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
export default function Admin() {
    const [tab, setTab] = useState("metrics");
    const tabs = [
        { id: "metrics", label: "Métricas", icon: "📊" },
        { id: "users", label: "Usuarios", icon: "👥" },
        { id: "roles", label: "Roles", icon: "🔐" },
        { id: "properties", label: "Propiedades", icon: "🏠" },
        { id: "blogs", label: "Blogs", icon: "📝" },
        { id: "smtp", label: "SMTP", icon: "📧" },
        { id: "api-keys", label: "API Keys", icon: "🔑" },
        { id: "analytics", label: "Analytics", icon: "📈" }
    ];
    return (_jsx("div", { className: "min-h-screen p-6", style: {
            background: `
        radial-gradient(1200px 800px at 20% -10%, rgba(124,58,237,.35), transparent 60%),
        radial-gradient(1200px 800px at 120% 110%, rgba(34,211,238,.25), transparent 60%),
        linear-gradient(160deg, #0f172a, #1e293b)
      `
        }, children: _jsx("div", { className: "max-w-7xl mx-auto", children: _jsxs("div", { className: "glass-card bg-white/7 backdrop-blur-lg border border-white/12 rounded-2xl p-8 relative overflow-hidden", children: [_jsx("div", { className: "absolute -top-2 -right-2 w-56 h-56 pointer-events-none", style: {
                            background: 'radial-gradient(closest-side, rgba(124,58,237,.3), transparent 70%)',
                            filter: 'blur(16px)',
                            transform: 'translate(18%, -18%)'
                        } }), _jsx("div", { className: "badge inline-flex items-center gap-2 text-xs text-white bg-purple-500/25 border border-purple-500/50 px-3 py-1.5 rounded-full mb-4", children: "MoOn \u2022 Admin" }), _jsx("h2", { className: "text-3xl font-semibold text-white mb-2 tracking-wide", children: "Panel de Administraci\u00F3n" }), _jsx("p", { className: "text-gray-400 text-sm mb-8", children: "Gestiona usuarios, propiedades y configuraciones del sistema" }), _jsx("div", { className: "flex flex-wrap gap-2 mb-8", children: tabs.map(t => (_jsxs("button", { onClick: () => setTab(t.id), className: `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${tab === t.id
                                ? 'bg-purple-500/20 text-white border border-purple-500/30 shadow-lg'
                                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'}`, children: [_jsx("span", { children: t.icon }), t.label] }, t.id))) }), _jsxs("div", { className: "bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6", children: [tab === "metrics" && _jsx(Metrics, {}), tab === "users" && _jsx(Users, {}), tab === "roles" && _jsx(Roles, {}), tab === "properties" && _jsx(Props, {}), tab === "blogs" && _jsx(Blogs, {}), tab === "smtp" && _jsx(SMTP, {}), tab === "api-keys" && _jsx(Keys, {}), tab === "analytics" && _jsx(Metrics, {})] })] }) }) }));
}
function Metrics() {
    const [m, setM] = useState({ totalUsuarios: 0, propiedadesListadas: 0, matchesActivos: 0, matchesExitosos: 0 });
    useEffect(() => { (async () => { const { data } = await api.get("/admin/metrics"); setM(data); })(); }, []);
    return (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsx(Card, { title: "Total de Usuarios", value: m.totalUsuarios, icon: "\uD83D\uDC65" }), _jsx(Card, { title: "Matches Activos", value: m.matchesActivos, icon: "\uD83D\uDD25" }), _jsx(Card, { title: "Propiedades Listadas", value: m.propiedadesListadas, icon: "\uD83C\uDFE0" }), _jsx(Card, { title: "Matches Exitosos", value: m.matchesExitosos, icon: "\u2705" })] }));
}
function Card({ title, value, icon }) {
    return (_jsxs("div", { className: "glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-all", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("span", { className: "text-2xl", children: icon }), _jsx("div", { className: "text-right", children: _jsx("div", { className: "text-2xl font-bold text-white", children: value }) })] }), _jsx("div", { className: "text-sm text-gray-400", children: title })] }));
}
function Users() {
    const [u, setU] = useState([]);
    useEffect(() => { (async () => { const { data } = await api.get("/users/admin/users"); setU(data.users || []); })(); }, []);
    return (_jsx("div", { className: "grid gap-4", children: u.map(x => (_jsx("div", { className: "glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-all", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "text-white font-medium", children: x.email }), _jsx("div", { className: "inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-3 py-1", children: _jsx("span", { className: "text-purple-300 text-sm font-medium", children: x.role }) })] }) }, x.id))) }));
}
function Roles() {
    const [u, setU] = useState([]);
    const [edit, setEdit] = useState(null);
    async function load() { const { data } = await api.get("/users/admin/users"); setU(data.users || []); }
    useEffect(() => { load(); }, []);
    async function change(userId, role) { await api.patch(`/users/admin/users/${userId}/role`, { role }); await load(); }
    return (_jsx("div", { className: "space-y-4", children: u.length === 0 ? (_jsxs("div", { className: "glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl mx-auto mb-4 flex items-center justify-center", children: _jsx("span", { className: "text-2xl", children: "\uD83D\uDC65" }) }), _jsx("h3", { className: "text-xl font-semibold text-white mb-2", children: "No hay usuarios" }), _jsx("p", { className: "text-gray-400", children: "Los usuarios registrados aparecer\u00E1n aqu\u00ED" })] })) : (u.map(x => (_jsx("div", { className: "glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all", children: _jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-white font-medium", children: x.email }), _jsx("div", { className: "text-gray-400 text-sm", children: "Usuario del sistema" })] }), _jsxs("select", { value: x.role, onChange: e => change(x.id, e.target.value), className: "px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl focus:border-purple-500/70 focus:ring-4 focus:ring-purple-500/15 focus:bg-white/12 transition-all outline-none", children: [_jsx("option", { value: "ADMIN", children: "\uD83D\uDC51 ADMIN" }), _jsx("option", { value: "INQUILINO", children: "\uD83C\uDFE0 INQUILINO" }), _jsx("option", { value: "PROPIETARIO", children: "\uD83C\uDFE2 PROPIETARIO" })] })] }) }, x.id)))) }));
}
function Props() {
    const [count, setCount] = useState(0);
    useEffect(() => { (async () => { const { data } = await api.get("/admin/metrics"); setCount(data.propiedadesListadas || 0); })(); }, []);
    return (_jsxs("div", { className: "glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center", children: _jsx("span", { className: "text-2xl", children: "\uD83C\uDFE0" }) }), _jsx("h3", { className: "text-2xl font-semibold text-white mb-2", children: count }), _jsx("p", { className: "text-gray-400", children: "Propiedades listadas en total" })] }));
}
function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    async function load() { const { data } = await api.get("/admin/blogs"); setBlogs(data.blogs || []); }
    useEffect(() => { load(); }, []);
    async function create() { await api.post("/admin/blogs", { title, content }); setTitle(""); setContent(""); await load(); }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "\uD83D\uDCDD Crear nuevo blog" }), _jsxs("div", { className: "space-y-4", children: [_jsx("input", { placeholder: "T\u00EDtulo del blog", value: title, onChange: e => setTitle(e.target.value), className: "w-full p-3 bg-white/8 border border-white/16 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12" }), _jsx("textarea", { placeholder: "Contenido del blog", value: content, onChange: e => setContent(e.target.value), rows: 4, className: "w-full p-3 bg-white/8 border border-white/16 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12 resize-none" }), _jsx("button", { onClick: create, className: "px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1", children: "\u2728 Crear Blog" })] })] }), _jsx("div", { className: "space-y-4", children: blogs.length === 0 ? (_jsxs("div", { className: "glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl mx-auto mb-4 flex items-center justify-center", children: _jsx("span", { className: "text-2xl", children: "\uD83D\uDCDD" }) }), _jsx("h3", { className: "text-xl font-semibold text-white mb-2", children: "No hay blogs" }), _jsx("p", { className: "text-gray-400", children: "Crea tu primer blog usando el formulario de arriba" })] })) : (blogs.map(b => (_jsxs("div", { className: "glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all", children: [_jsx("h4", { className: "text-lg font-semibold text-white mb-3", children: b.title }), _jsx("div", { className: "text-gray-300 whitespace-pre-wrap leading-relaxed", children: b.content })] }, b.id)))) })] }));
}
function SMTP() {
    const [s, setS] = useState({ host: "", port: 465, user: "", fromEmail: "", secure: true });
    useEffect(() => { (async () => { const { data } = await api.get("/admin/smtp"); if (data.smtp)
        setS(data.smtp); })(); }, []);
    async function save() { await api.put("/admin/smtp", s); alert("Guardado"); }
    return (_jsxs("div", { className: "glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "\uD83D\uDCE7 Configuraci\u00F3n SMTP" }), _jsxs("div", { className: "grid gap-4 max-w-md", children: [_jsx("input", { placeholder: "Host del servidor", value: s.host || "", onChange: e => setS({ ...s, host: e.target.value }), className: "w-full p-3 bg-white/8 border border-white/16 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12" }), _jsx("input", { placeholder: "Puerto", type: "number", value: s.port || 465, onChange: e => setS({ ...s, port: Number(e.target.value) }), className: "w-full p-3 bg-white/8 border border-white/16 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12" }), _jsx("input", { placeholder: "Usuario", value: s.user || "", onChange: e => setS({ ...s, user: e.target.value }), className: "w-full p-3 bg-white/8 border border-white/16 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12" }), _jsx("input", { placeholder: "Email remitente", value: s.fromEmail || "", onChange: e => setS({ ...s, fromEmail: e.target.value }), className: "w-full p-3 bg-white/8 border border-white/16 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12" }), _jsxs("label", { className: "flex items-center gap-3 text-white", children: [_jsx("input", { type: "checkbox", checked: !!s.secure, onChange: e => setS({ ...s, secure: e.target.checked }), className: "w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2" }), _jsx("span", { className: "text-sm", children: "\uD83D\uDD12 Usar SSL/TLS" })] }), _jsx("button", { onClick: save, className: "px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1", children: "\uD83D\uDCBE Guardar configuraci\u00F3n" })] })] }));
}
function Keys() {
    const [keys, setKeys] = useState([]);
    const [label, setLabel] = useState("");
    async function load() { const { data } = await api.get("/admin/api-keys"); setKeys(data.keys || []); }
    useEffect(() => { load(); }, []);
    async function create() {
        const result = await api.post("/admin/api-keys", { label });
        if (result && 'data' in result) {
            alert("Tu clave: " + result.data.plaintext);
        }
        setLabel("");
        await load();
    }
    async function revoke(id) { await api.delete(`/admin/api-keys/${id}`); await load(); }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "\uD83D\uDD11 Crear nueva API Key" }), _jsxs("div", { className: "flex gap-4", children: [_jsx("input", { placeholder: "Etiqueta descriptiva", value: label, onChange: e => setLabel(e.target.value), className: "flex-1 p-3 bg-white/8 border border-white/16 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12" }), _jsx("button", { onClick: create, className: "px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1", children: "\u2728 Crear clave" })] })] }), _jsx("div", { className: "space-y-4", children: keys.length === 0 ? (_jsxs("div", { className: "glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl mx-auto mb-4 flex items-center justify-center", children: _jsx("span", { className: "text-2xl", children: "\uD83D\uDD11" }) }), _jsx("h3", { className: "text-xl font-semibold text-white mb-2", children: "No hay API Keys" }), _jsx("p", { className: "text-gray-400", children: "Crea tu primera clave API usando el formulario de arriba" })] })) : (keys.map(k => (_jsx("div", { className: "glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-white font-medium", children: k.label }), _jsxs("p", { className: "text-gray-400 text-sm", children: ["Creada: ", new Date(k.createdAt).toLocaleDateString()] })] }), _jsx("button", { onClick: () => revoke(k.id), className: "px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 font-medium rounded-xl hover:bg-red-500/30 transition-all", children: "\uD83D\uDDD1\uFE0F Revocar" })] }) }, k.id)))) })] }));
}
