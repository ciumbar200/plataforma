import { FormEvent, useState } from "react";
import { AuthService } from "../lib/auth";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login"|"register">("login");
  const [role, setRole] = useState<"INQUILINO"|"PROPIETARIO">("INQUILINO");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { refresh } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setMsg("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      if (mode === "register") {
        if (!name) {
          setMsg("Por favor ingresa tu nombre");
          setLoading(false);
          return;
        }
        await AuthService.signUp(email, password, { name, role });
        setMsg("Registro exitoso. Revisa tu email para confirmar tu cuenta.");
      } else {
        await AuthService.signIn(email, password);
        await refresh();
        setMsg("Inicio de sesión exitoso");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setMsg(error.message || "Error en la autenticación");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      await AuthService.signInWithGoogle();
    } catch (error: any) {
      console.error("Google auth error:", error);
      setMsg(error.message || "Error con Google");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Login Form */}
      <div className="glass-card bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full max-w-md mx-4 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            MoOn Pro
          </h1>
          <p className="text-gray-300">
            {mode === "login" ? "Inicia sesión en tu cuenta" : "Crea tu cuenta"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 bg-white/8 border border-white/16 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
                placeholder="Tu nombre completo"
                required={mode === "register"}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-white/8 border border-white/16 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-white/8 border border-white/16 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
              placeholder="••••••••"
              required
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de usuario
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "INQUILINO"|"PROPIETARIO")}
                className="w-full p-4 bg-white/8 border border-white/16 rounded-xl text-white outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
              >
                <option value="INQUILINO" className="bg-gray-800">Inquilino (Busco habitación)</option>
                <option value="PROPIETARIO" className="bg-gray-800">Propietario (Tengo habitación)</option>
              </select>
            </div>
          )}

          {msg && (
            <div className={`p-4 rounded-xl text-sm ${
              msg.includes("exitoso") 
                ? "bg-green-500/20 border border-green-500/30 text-green-300" 
                : "bg-red-500/20 border border-red-500/30 text-red-300"
            }`}>
              {msg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? "Cargando..." : (mode === "login" ? "Iniciar Sesión" : "Registrarse")}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-gray-400">o continúa con</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-4 w-full py-4 bg-white/8 border border-white/16 text-white font-semibold rounded-xl hover:bg-white/12 transition-all duration-200 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setMsg("");
            }}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            {mode === "login" 
              ? "¿No tienes cuenta? Regístrate" 
              : "¿Ya tienes cuenta? Inicia sesión"
            }
          </button>
        </div>
      </div>
    </div>
  );
}
