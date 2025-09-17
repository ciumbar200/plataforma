import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { api } from "../lib/api";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState("login");
    const [role, setRole] = useState("INQUILINO");
    const [msg, setMsg] = useState("");
    async function onSubmit(e) {
        e.preventDefault();
        setMsg("");
        try {
            if (mode === "login")
                await api.post("/auth/login", { email, password });
            else
                await api.post("/auth/register", { email, password, role });
            window.location.href = "/";
        }
        catch (e) {
            setMsg(e?.response?.data?.error || "Error");
        }
    }
    function google() {
        const base = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
        window.location.href = `${base}/auth/google`;
    }
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center p-6", style: {
            background: `
        radial-gradient(1200px 800px at 20% -10%, rgba(124,58,237,.35), transparent 60%),
        radial-gradient(1200px 800px at 120% 110%, rgba(34,211,238,.25), transparent 60%),
        linear-gradient(160deg, #0f172a, #1e293b)
      `
        }, children: _jsxs("div", { className: "card glass-card relative overflow-hidden", style: {
                width: 'min(420px, 92vw)',
                background: 'rgba(255, 255, 255, 0.07)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,.35)',
                padding: 'clamp(18px, 2.4vw, 26px)'
            }, children: [_jsx("div", { className: "absolute -top-2 -right-2 w-56 h-56 pointer-events-none", style: {
                        background: 'radial-gradient(closest-side, rgba(124,58,237,.3), transparent 70%)',
                        filter: 'blur(16px)',
                        transform: 'translate(18%, -18%)'
                    } }), _jsx("div", { className: "badge inline-flex items-center gap-2 text-xs text-white bg-purple-500/25 border border-purple-500/50 px-3 py-1.5 rounded-full mb-3", children: "MoOn \u2022 Glass UI" }), _jsx("h1", { className: "text-2xl font-semibold text-white mb-2 tracking-wide", children: mode === "login" ? "Bienvenido de vuelta" : "Únete a MoOn" }), _jsx("p", { className: "text-gray-400 text-sm mb-6", children: mode === "login" ? "Inicia sesión para continuar" : "Crea tu cuenta para empezar" }), _jsxs("form", { onSubmit: onSubmit, className: "space-y-4", children: [mode === "register" && (_jsxs("div", { className: "field", children: [_jsx("label", { className: "block text-xs text-gray-400 mb-2", children: "Rol *" }), _jsxs("select", { value: role, onChange: e => setRole(e.target.value), className: "w-full p-3 rounded-xl bg-white/8 border border-white/16 text-white outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12", children: [_jsx("option", { value: "INQUILINO", children: "Inquilino \u2014 Busco compa\u00F1ero" }), _jsx("option", { value: "PROPIETARIO", children: "Propietario \u2014 Publicar propiedad" })] })] })), _jsxs("div", { className: "field", children: [_jsx("label", { className: "block text-xs text-gray-400 mb-2", children: "Email *" }), _jsx("input", { type: "email", placeholder: "tu@email.com", value: email, onChange: e => setEmail(e.target.value), className: "w-full p-3 rounded-xl bg-white/8 border border-white/16 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12" })] }), _jsxs("div", { className: "field", children: [_jsx("label", { className: "block text-xs text-gray-400 mb-2", children: "Contrase\u00F1a *" }), _jsx("input", { type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: e => setPassword(e.target.value), className: "w-full p-3 rounded-xl bg-white/8 border border-white/16 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12" })] }), msg && (_jsx("div", { className: "p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm", children: msg })), _jsxs("div", { className: "flex flex-col gap-3 pt-2", children: [_jsx("button", { type: "submit", className: "btn w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 hover:brightness-105 hover:shadow-[0_10px_26px_rgba(124,58,237,.45)] active:translate-y-px", style: {
                                        background: 'linear-gradient(135deg, #7c3aed, #22d3ee)',
                                        boxShadow: '0 8px 22px rgba(124,58,237,.35)'
                                    }, children: mode === "login" ? "Iniciar Sesión" : "Crear Cuenta" }), _jsx("button", { type: "button", onClick: google, className: "w-full py-3 px-4 rounded-xl font-medium text-gray-300 bg-transparent border border-white/18 hover:bg-white/5 transition-all duration-200", children: "Continuar con Google" })] })] }), _jsx("div", { className: "text-center mt-6", children: _jsx("button", { onClick: () => setMode(mode === "login" ? "register" : "login"), className: "text-sm text-gray-400 hover:text-white transition-colors cursor-pointer", children: mode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión" }) })] }) }));
}
