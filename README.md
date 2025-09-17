# MoOn Pro (v2) — React + Node/Express + PostgreSQL + Google/Email Auth (Vercel)

## Roles
- **ADMIN**, **INQUILINO**, **PROPIETARIO**

## Funcionalidades
- Panel Admin: Métricas, Usuarios, Roles, Propiedades (conteo), Blogs (CRUD), SMTP (config), Claves API (crear/revocar), Analíticas (same que métricas).
- Inquilino: "Tinder" sin corazones para buscar compañero, % de match en verde, ver propiedades (públicas + privadas desbloqueadas por match), enviar interés.
- Propietario: crear/gestionar propiedades, fotos por URL, visibilidad Pública vs Privada (MATCHED_ONLY), dashboard con ganancias estimadas, candidatos y aceptar/rechazar matches.
- Todos: Perfil obligatorio con **foto** + **vídeo** + ciudad + nivel de ruido + distancia + sobre mí + intereses (nube). "Mi Cuenta" + planes (por defecto `standard`).

## Backend (server)
```bash
cd server
cp .env.example .env  # Rellena DATABASE_URL, JWT_SECRET, CLIENT_ORIGIN, GOOGLE_CLIENT_ID, ...
npm i
npx prisma generate
npx prisma migrate dev
npm run dev # http://localhost:3000
```

## Frontend (web)
```bash
cd web
cp .env.example .env   # VITE_API_URL=http://localhost:3000/api
npm i
npm run dev # http://localhost:5173
```

## Google OAuth
- Crea credenciales tipo **Web** en Google Cloud Console.
- Redirect local: `http://localhost:3000/api/auth/google/callback`
- Producción: `https://TU-BACKEND.vercel.app/api/auth/google/callback`

## Deploy en Vercel
- Proyecto Backend -> root `server/` (variables: `DATABASE_URL`, `JWT_SECRET`, `CLIENT_ORIGIN`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OAUTH_REDIRECT_URI`).
- Proyecto Frontend -> root `web/` (`VITE_API_URL=https://TU-BACKEND.vercel.app/api`).

## Mejoras sugeridas
- Subidas directas a Cloudinary/S3 en lugar de URLs.
- Emails transaccionales usando la configuración SMTP.
- Verificación de email y reset de contraseña.
- OpenAPI + Swagger para documentar la API.
- Rate limiting y logs estructurados (pino).
```

