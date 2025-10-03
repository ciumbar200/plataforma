import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://vogzzdnxoldgfpsrobps.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvZ3p6ZG54b2xkZ2Zwc3JvYnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNTIyOTQsImV4cCI6MjA3MzYyODI5NH0.c9H6a7zVtr7-eM1eOQxe6K-xdAVhqIHZqVQ8a6raNMk"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/*
¡NOTA IMPORTANTE SOBRE LA BASE DE DATOS!

**PROBLEMA 1:** La sección "Descubrir" no muestra perfiles de otros inquilinos.
**CAUSA:** La política de Seguridad a Nivel de Fila (RLS) en la tabla `profiles` es demasiado restrictiva.

**PROBLEMA 2:** Los datos del registro (nombre, edad) no se guardan y aparecen por defecto.
**CAUSA:** La creación del perfil desde el cliente es propensa a errores y condiciones de carrera.

**SOLUCIÓN INTEGRAL:** Ejecuta el siguiente script SQL en el "SQL Editor" de tu panel de Supabase
para aplicar las políticas y automatizaciones correctas.

--- PEGA ESTE CÓDIGO EN EL SQL EDITOR DE SUPABASE Y HAZ CLIC EN "RUN" ---

-- 1. Permite a los usuarios autenticados ver todos los perfiles (para la sección "Descubrir").
-- Esto soluciona el problema de la pérdida de datos del registro (nombre, edad).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, age, role, avatar_url, rental_goal, city, locality)
  values (
    new.id,
    new.raw_user_meta_data ->> 'name',
    new.email,
    (new.raw_user_meta_data ->> 'age')::int,
    (new.raw_user_meta_data ->> 'role')::public.user_role,
    new.raw_user_meta_data ->> 'avatar_url',
    (new.raw_user_meta_data ->> 'rental_goal')::public.rental_goal,
    new.raw_user_meta_data ->> 'city',
    new.raw_user_meta_data ->> 'locality'
  );
  return new;
end;
$$;

-- 3. Trigger que ejecuta la función anterior después de que se crea un usuario en `auth.users`.
-- Esto automatiza la creación del perfil de forma fiable.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();DROP POLICY IF EXISTS "Authenticated users can view all profiles." ON public.profiles;
CREATE POLICY "Authenticated users can view all profiles."
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- 2. Función para crear automáticamente un perfil cuando un nuevo usuario se registra.


--- FIN DEL CÓDIGO ---

Una vez ejecutado este script, ambos problemas quedarán solucionados de forma definitiva.
*/