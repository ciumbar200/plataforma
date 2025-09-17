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
  
  return (
    <div className="min-h-screen p-6" style={{
      background: `
        radial-gradient(1200px 800px at 20% -10%, rgba(124,58,237,.35), transparent 60%),
        radial-gradient(1200px 800px at 120% 110%, rgba(34,211,238,.25), transparent 60%),
        linear-gradient(160deg, #0f172a, #1e293b)
      `
    }}>
      <div className="max-w-7xl mx-auto">
        <div className="glass-card bg-white/7 backdrop-blur-lg border border-white/12 rounded-2xl p-8 relative overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute -top-2 -right-2 w-56 h-56 pointer-events-none" style={{
            background: 'radial-gradient(closest-side, rgba(124,58,237,.3), transparent 70%)',
            filter: 'blur(16px)',
            transform: 'translate(18%, -18%)'
          }}></div>
          
          <div className="badge inline-flex items-center gap-2 text-xs text-white bg-purple-500/25 border border-purple-500/50 px-3 py-1.5 rounded-full mb-4">
            MoOn • Admin
          </div>
          
          <h2 className="text-3xl font-semibold text-white mb-2 tracking-wide">Panel de Administración</h2>
          <p className="text-gray-400 text-sm mb-8">Gestiona usuarios, propiedades y configuraciones del sistema</p>
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map(t => (
              <button 
                key={t.id} 
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  tab === t.id 
                    ? 'bg-purple-500/20 text-white border border-purple-500/30 shadow-lg' 
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            {tab==="metrics" && <Metrics />}
            {tab==="users" && <Users />}
            {tab==="roles" && <Roles />}
            {tab==="properties" && <Props />}
            {tab==="blogs" && <Blogs />}
            {tab==="smtp" && <SMTP />}
            {tab==="api-keys" && <Keys />}
            {tab==="analytics" && <Metrics />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metrics() {
  const [m,setM]=useState<any>({totalUsuarios:0, propiedadesListadas:0, matchesActivos:0, matchesExitosos:0});
  useEffect(()=>{ (async()=>{ const {data}=await api.get("/admin/metrics"); setM(data); })(); },[]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card title="Total de Usuarios" value={m.totalUsuarios} icon="👥" />
      <Card title="Matches Activos" value={m.matchesActivos} icon="🔥" />
      <Card title="Propiedades Listadas" value={m.propiedadesListadas} icon="🏠" />
      <Card title="Matches Exitosos" value={m.matchesExitosos} icon="✅" />
    </div>
  );
}

function Card({title,value,icon}:any){
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

function Users(){
  const [u,setU]=useState<any[]>([]);
  useEffect(()=>{ (async()=>{ const {data}=await api.get("/users/admin/users"); setU(data.users||[]); })(); },[]);
  return (
    <div className="grid gap-4">
      {u.map(x=>(
        <div key={x.id} className="glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-all">
          <div className="flex items-center justify-between">
            <div className="text-white font-medium">{x.email}</div>
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-3 py-1">
              <span className="text-purple-300 text-sm font-medium">{x.role}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
function Roles(){
  const [u,setU]=useState<any[]>([]);
  const [edit,setEdit]=useState<any>(null);
  async function load(){ const {data}=await api.get("/users/admin/users"); setU(data.users||[]); }
  useEffect(()=>{ load(); },[]);
  async function change(userId:string, role:string){ await api.patch(`/users/admin/users/${userId}/role`, { role }); await load(); }
  return (
    <div className="space-y-4">
      {u.length === 0 ? (
        <div className="glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No hay usuarios</h3>
          <p className="text-gray-400">Los usuarios registrados aparecerán aquí</p>
        </div>
      ) : (
        u.map(x=>(
          <div key={x.id} className="glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <div className="text-white font-medium">{x.email}</div>
                <div className="text-gray-400 text-sm">Usuario del sistema</div>
              </div>
              <select 
                value={x.role} 
                onChange={e=>change(x.id, e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl focus:border-purple-500/70 focus:ring-4 focus:ring-purple-500/15 focus:bg-white/12 transition-all outline-none"
              >
                <option value="ADMIN">👑 ADMIN</option>
                <option value="INQUILINO">🏠 INQUILINO</option>
                <option value="PROPIETARIO">🏢 PROPIETARIO</option>
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
function Props(){
  const [count,setCount]=useState(0);
  useEffect(()=>{ (async()=>{ const {data}=await api.get("/admin/metrics"); setCount(data.propiedadesListadas||0); })(); },[]);
  return (
    <div className="glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
        <span className="text-2xl">🏠</span>
      </div>
      <h3 className="text-2xl font-semibold text-white mb-2">{count}</h3>
      <p className="text-gray-400">Propiedades listadas en total</p>
    </div>
  )
}
function Blogs(){
  const [blogs,setBlogs]=useState<any[]>([]);
  const [title,setTitle]=useState(""); const [content,setContent]=useState("");
  async function load(){ const {data}=await api.get("/admin/blogs"); setBlogs(data.blogs||[]); }
  useEffect(()=>{ load(); },[]);
  async function create(){ await api.post("/admin/blogs",{title,content}); setTitle(""); setContent(""); await load(); }
  return (
    <div className="space-y-6">
      <div className="glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📝 Crear nuevo blog</h3>
        <div className="space-y-4">
          <input 
            placeholder="Título del blog" 
            value={title} 
            onChange={e=>setTitle(e.target.value)}
            className="w-full p-3 bg-white/8 border border-white/16 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
          />
          <textarea 
            placeholder="Contenido del blog" 
            value={content} 
            onChange={e=>setContent(e.target.value)}
            rows={4}
            className="w-full p-3 bg-white/8 border border-white/16 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12 resize-none"
          />
          <button 
            onClick={create}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            ✨ Crear Blog
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {blogs.length === 0 ? (
          <div className="glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No hay blogs</h3>
            <p className="text-gray-400">Crea tu primer blog usando el formulario de arriba</p>
          </div>
        ) : (
          blogs.map(b=>(
            <div key={b.id} className="glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all">
              <h4 className="text-lg font-semibold text-white mb-3">{b.title}</h4>
              <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">{b.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
function SMTP(){
  const [s,setS]=useState<any>({host:"",port:465,user:"",fromEmail:"",secure:true});
  useEffect(()=>{ (async()=>{ const {data}=await api.get("/admin/smtp"); if(data.smtp) setS(data.smtp); })(); },[]);
  async function save(){ await api.put("/admin/smtp", s); alert("Guardado"); }
  return (
    <div className="glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">📧 Configuración SMTP</h3>
      <div className="grid gap-4 max-w-md">
        <input 
          placeholder="Host del servidor" 
          value={s.host||""} 
          onChange={e=>setS({...s,host:e.target.value})}
          className="w-full p-3 bg-white/8 border border-white/16 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
        />
        <input 
          placeholder="Puerto" 
          type="number" 
          value={s.port||465} 
          onChange={e=>setS({...s,port:Number(e.target.value)})}
          className="w-full p-3 bg-white/8 border border-white/16 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
        />
        <input 
          placeholder="Usuario" 
          value={s.user||""} 
          onChange={e=>setS({...s,user:e.target.value})}
          className="w-full p-3 bg-white/8 border border-white/16 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
        />
        <input 
          placeholder="Email remitente" 
          value={s.fromEmail||""} 
          onChange={e=>setS({...s,fromEmail:e.target.value})}
          className="w-full p-3 bg-white/8 border border-white/16 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
        />
        <label className="flex items-center gap-3 text-white">
          <input 
            type="checkbox" 
            checked={!!s.secure} 
            onChange={e=>setS({...s,secure:e.target.checked})}
            className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
          />
          <span className="text-sm">🔒 Usar SSL/TLS</span>
        </label>
        <button 
          onClick={save}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
        >
          💾 Guardar configuración
        </button>
      </div>
    </div>
  )
}
function Keys(){
  const [keys,setKeys]=useState<any[]>([]);
  const [label,setLabel]=useState("");
  async function load(){ const {data}=await api.get("/admin/api-keys"); setKeys(data.keys||[]); }
  useEffect(()=>{ load(); },[]);
  async function create(){ 
    const result = await api.post("/admin/api-keys",{label}); 
    if (result && 'data' in result) {
      alert("Tu clave: " + result.data.plaintext); 
    }
    setLabel(""); 
    await load(); 
  }
  async function revoke(id:string){ await api.delete(`/admin/api-keys/${id}`); await load(); }
  return (
    <div className="space-y-6">
      <div className="glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">🔑 Crear nueva API Key</h3>
        <div className="flex gap-4">
          <input 
            placeholder="Etiqueta descriptiva" 
            value={label} 
            onChange={e=>setLabel(e.target.value)}
            className="flex-1 p-3 bg-white/8 border border-white/16 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500/70 focus:shadow-[0_0_0_4px_rgba(124,58,237,.15)] focus:bg-white/12"
          />
          <button 
            onClick={create}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            ✨ Crear clave
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {keys.length === 0 ? (
          <div className="glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🔑</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No hay API Keys</h3>
            <p className="text-gray-400">Crea tu primera clave API usando el formulario de arriba</p>
          </div>
        ) : (
          keys.map(k=>(
            <div key={k.id} className="glass-card bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">{k.label}</h4>
                  <p className="text-gray-400 text-sm">Creada: {new Date(k.createdAt).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={()=>revoke(k.id)}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 font-medium rounded-xl hover:bg-red-500/30 transition-all"
                >
                  🗑️ Revocar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
   )
 }
