-- CORREÇÃO: handle_new_user() referenciava "profiles" sem qualificar o schema.
-- Como a função roda como SECURITY DEFINER dentro da transação interna do
-- GoTrue (role supabase_auth_admin), o search_path dessa sessão não inclui
-- "public" — por isso a criação de qualquer usuário novo falhava com
-- "Database error creating new user". Rode isto no SQL Editor do Supabase:

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, username, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'username',
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'vendedor')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
