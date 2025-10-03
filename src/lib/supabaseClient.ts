import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://vogzzdnxoldgfpsrobps.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvZ3p6ZG54b2xkZ2Zwc3JvYnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNTIyOTQsImV4cCI6MjA3MzYyODI5NH0.c9H6a7zVtr7-eM1eOQxe6K-xdAVhqIHZqVQ8a6raNMk"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/*
¡NOTA IMPORTANTE SOBRE LA BASE DE DATOS!

**PROBLEMA:** La sección "Descubrir" no muestra perfiles de otros inquilinos.

**CAUSA:** La política de Seguridad a Nivel de Fila (RLS) en la tabla `profiles` es demasiado restrictiva.
La política actual solo permite a un usuario leer su PROPIO perfil, por lo que la aplicación no puede
obtener la lista de otros usuarios.

**SOLUCIÓN:** Ejecuta el siguiente script SQL en el "SQL Editor" de tu panel de Supabase
para aplicar la política correcta.

--- PEGA ESTE CÓDIGO EN EL SQL EDITOR DE SUPABASE ---

-- 1. Elimina cualquier política de selección restrictiva que pueda existir.
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles." ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

-- 2. Crea la nueva política que permite a los usuarios autenticados ver todos los perfiles.
-- Esto es necesario para que la función "Descubrir" funcione.
CREATE POLICY "Authenticated users can view all profiles."
ON public.profiles FOR SELECT
TO authenticated
USING (true);

--- FIN DEL CÓDIGO ---

Una vez ejecutado este script, la sección "Descubrir" volverá a mostrar los perfiles correctamente.
Recuerda que las políticas para INSERT y UPDATE deben seguir siendo restrictivas para que
un usuario solo pueda modificar sus propios datos.
*/