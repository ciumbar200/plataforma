# 🚀 Guía de Deployment - MoOn Pro v2

## Migración de Cloud Run a Supabase + Vercel

Esta guía te ayudará a desplegar tu aplicación MoOn Pro en Supabase (backend) y Vercel (frontend).

## 📋 Prerrequisitos

- Cuenta de [Supabase](https://supabase.com)
- Cuenta de [Vercel](https://vercel.com)
- Cuenta de Google Cloud (para OAuth)
- Git repository configurado

## 🗄️ Paso 1: Configurar Supabase

### 1.1 Crear Proyecto en Supabase

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Crea un nuevo proyecto
3. Anota la **URL del proyecto** y **anon key**

### 1.2 Configurar Base de Datos

1. Ve a **SQL Editor** en tu proyecto Supabase
2. Ejecuta el archivo `supabase-schema.sql` que se encuentra en la raíz del proyecto
3. Esto creará todas las tablas, índices, políticas RLS y triggers necesarios

### 1.3 Configurar Autenticación

1. Ve a **Authentication > Settings**
2. Configura **Site URL**: `https://tu-dominio.vercel.app`
3. Añade **Redirect URLs**:
   - `https://tu-dominio.vercel.app/auth/callback`
   - `http://localhost:5173/auth/callback` (para desarrollo)

### 1.4 Configurar Google OAuth

1. Ve a **Authentication > Providers**
2. Habilita **Google**
3. Configura:
   - **Client ID**: Tu Google Client ID
   - **Client Secret**: Tu Google Client Secret

### 1.5 Configurar Variables de Entorno en Supabase

Ve a **Settings > Environment Variables** y configura:

```env
# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# JWT (opcional, Supabase maneja esto automáticamente)
JWT_SECRET=tu_jwt_secret_personalizado
```

## 🌐 Paso 2: Configurar Vercel

### 2.1 Conectar Repositorio

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Importa tu repositorio Git
3. Selecciona la carpeta `web` como directorio raíz

### 2.2 Configurar Variables de Entorno

En **Settings > Environment Variables**, añade:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

### 2.3 Configurar Build Settings

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 🔧 Paso 3: Actualizar Configuraciones

### 3.1 Actualizar URLs en Supabase

Una vez que tengas tu dominio de Vercel:

1. Ve a **Authentication > Settings** en Supabase
2. Actualiza **Site URL** con tu dominio de producción
3. Actualiza **Redirect URLs** con tu dominio de producción

### 3.2 Actualizar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Ve a **APIs & Services > Credentials**
3. Edita tu OAuth 2.0 Client ID
4. Añade a **Authorized redirect URIs**:
   - `https://tu-proyecto.supabase.co/auth/v1/callback`

## 📊 Paso 4: Migrar Datos (Opcional)

Si tienes datos existentes en tu base de datos actual:

### 4.1 Exportar Datos

```bash
# Desde tu base de datos actual
pg_dump tu_database_url > backup.sql
```

### 4.2 Importar a Supabase

1. Ve a **SQL Editor** en Supabase
2. Ejecuta tu backup SQL (ajustando los tipos de datos si es necesario)

## 🧪 Paso 5: Testing

### 5.1 Verificar Funcionalidades

- [ ] Registro de usuarios
- [ ] Login con email/password
- [ ] Login con Google
- [ ] CRUD de propiedades
- [ ] Sistema de matches
- [ ] Panel de administración
- [ ] API Keys

### 5.2 Verificar RLS (Row Level Security)

- [ ] Los usuarios solo pueden ver sus propios datos
- [ ] Los administradores tienen acceso completo
- [ ] Las políticas de seguridad funcionan correctamente

## 🔒 Paso 6: Seguridad

### 6.1 Configurar RLS Policies

Las políticas ya están configuradas en el schema, pero verifica:

- Usuarios pueden ver/editar solo sus datos
- Propiedades públicas son visibles para todos los autenticados
- Solo administradores pueden gestionar blogs y configuraciones

### 6.2 Configurar CORS

En Supabase, ve a **Settings > API** y verifica que tu dominio esté permitido.

## 📈 Paso 7: Monitoreo

### 7.1 Supabase Analytics

- Ve a **Reports** para ver métricas de uso
- Configura alertas para errores

### 7.2 Vercel Analytics

- Habilita **Analytics** en tu proyecto Vercel
- Configura **Speed Insights** para monitoreo de rendimiento

## 🚨 Troubleshooting

### Errores Comunes

1. **CORS Error**: Verifica las URLs en Supabase Auth settings
2. **RLS Error**: Verifica que las políticas RLS estén configuradas
3. **OAuth Error**: Verifica las redirect URIs en Google Cloud Console
4. **Build Error**: Verifica que todas las dependencias estén instaladas

### Logs

- **Supabase**: Ve a **Logs** en el dashboard
- **Vercel**: Ve a **Functions** > **View Function Logs**

## 📝 Notas Importantes

1. **Backup**: Siempre haz backup de tu base de datos antes de migrar
2. **Testing**: Prueba en un entorno de staging antes de producción
3. **DNS**: Configura tu dominio personalizado en Vercel si es necesario
4. **SSL**: Vercel proporciona SSL automáticamente
5. **CDN**: Vercel incluye CDN global automáticamente

## 🎯 Próximos Pasos

Después del deployment:

1. Configura monitoreo y alertas
2. Implementa backups automáticos
3. Configura CI/CD para deployments automáticos
4. Optimiza rendimiento con caching
5. Implementa analytics y métricas de negocio

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs de Supabase y Vercel
2. Verifica las configuraciones de autenticación
3. Consulta la documentación oficial de Supabase y Vercel
4. Verifica que todas las variables de entorno estén configuradas correctamente

---

¡Tu aplicación MoOn Pro está lista para producción! 🎉