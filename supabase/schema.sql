-- ============================================
-- RUSH APP - Dental Marechal
-- Schema do banco de dados Supabase
-- ============================================

-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'vendedor', 'entregador');
CREATE TYPE delivery_status AS ENUM (
  'aguardando_atribuicao',
  'rota_definida',
  'em_rota',
  'entregue',
  'recusada'
);
CREATE TYPE delivery_action AS ENUM ('entregar', 'receber', 'assinar_nota');
CREATE TYPE delivery_period AS ENUM ('manha', 'tarde');
CREATE TYPE receiver_role AS ENUM ('secretaria', 'porteiro', 'morador_vizinho', 'proprietario');

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  username TEXT UNIQUE,
  role user_role NOT NULL DEFAULT 'vendedor',
  phone TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- CLIENTES
-- ============================================
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ENDERECOS (1:N com clientes)
-- ============================================
CREATE TABLE enderecos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  label TEXT, -- ex: "Escritório", "Casa", "Filial Centro"
  rua TEXT NOT NULL,
  numero TEXT NOT NULL,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT NOT NULL,
  cep TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_enderecos_cliente ON enderecos(cliente_id);

-- ============================================
-- ENTREGAS
-- ============================================
CREATE SEQUENCE entregas_order_number_seq;

CREATE TABLE entregas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number INTEGER NOT NULL UNIQUE DEFAULT nextval('entregas_order_number_seq'),

  -- Quem criou
  created_by UUID NOT NULL REFERENCES profiles(id),

  -- Cliente e endereço
  cliente_id UUID NOT NULL REFERENCES clientes(id),
  endereco_id UUID NOT NULL REFERENCES enderecos(id),

  -- Entregador atribuído
  entregador_id UUID REFERENCES profiles(id),

  -- Dados da entrega
  valor DECIMAL(10,2),
  status delivery_status NOT NULL DEFAULT 'aguardando_atribuicao',
  actions delivery_action[] NOT NULL DEFAULT '{entregar}',

  -- Programação
  scheduled_period delivery_period,
  scheduled_date DATE,
  is_urgent BOOLEAN NOT NULL DEFAULT false,

  -- Lembrete de devolução
  return_reminder BOOLEAN NOT NULL DEFAULT false,

  -- Interessado
  interested_name TEXT,
  interested_note TEXT,

  -- Observações
  notes TEXT,

  -- Ordem na rota (definida pelo despachante ou otimizador)
  route_order INTEGER,

  -- Registro de entrega (preenchido pelo motoboy)
  receiver_name TEXT,
  receiver_role receiver_role,
  receiver_note TEXT,
  delivered_at TIMESTAMPTZ,

  -- Adiada (pulada na rota)
  is_postponed BOOLEAN NOT NULL DEFAULT false,

  -- Recusa
  refusal_reason TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_entregas_entregador ON entregas(entregador_id);
CREATE INDEX idx_entregas_status ON entregas(status);
CREATE INDEX idx_entregas_date ON entregas(created_at);
CREATE INDEX idx_entregas_cliente ON entregas(cliente_id);

-- ============================================
-- FOTOS DE ENTREGA
-- ============================================
CREATE TABLE entrega_fotos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entrega_id UUID NOT NULL REFERENCES entregas(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_fotos_entrega ON entrega_fotos(entrega_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER clientes_updated_at
  BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER entregas_updated_at
  BEFORE UPDATE ON entregas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enderecos ENABLE ROW LEVEL SECURITY;
ALTER TABLE entregas ENABLE ROW LEVEL SECURITY;
ALTER TABLE entrega_fotos ENABLE ROW LEVEL SECURITY;

-- Profiles: todos autenticados podem ler, só admin edita
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "profiles_insert" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    OR id = auth.uid()
  );

CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE TO authenticated
  USING (
    id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Clientes: admin e vendedor podem CRUD
CREATE POLICY "clientes_select" ON clientes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "clientes_insert" ON clientes
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'vendedor'))
  );

CREATE POLICY "clientes_update" ON clientes
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'vendedor'))
  );

-- Enderecos: mesmas regras de clientes
CREATE POLICY "enderecos_select" ON enderecos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "enderecos_insert" ON enderecos
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'vendedor'))
  );

CREATE POLICY "enderecos_update" ON enderecos
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'vendedor'))
  );

-- Entregas: todos veem, admin/vendedor criam, entregador atualiza as suas
CREATE POLICY "entregas_select" ON entregas
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'vendedor'))
    OR entregador_id = auth.uid()
  );

CREATE POLICY "entregas_insert" ON entregas
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'vendedor'))
  );

CREATE POLICY "entregas_update" ON entregas
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'vendedor'))
    OR entregador_id = auth.uid()
  );

-- Fotos: entregador insere nas suas entregas, todos autenticados leem
CREATE POLICY "fotos_select" ON entrega_fotos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "fotos_insert" ON entrega_fotos
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM entregas
      WHERE entregas.id = entrega_id
      AND entregas.entregador_id = auth.uid()
    )
  );

-- ============================================
-- STORAGE BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('entregas', 'entregas', false)
ON CONFLICT DO NOTHING;

CREATE POLICY "entregas_storage_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'entregas');

CREATE POLICY "entregas_storage_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'entregas');

-- ============================================
-- REALTIME
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE entregas;

-- ============================================
-- MIGRATION: username login (run on an existing database)
-- Cadastro de vendedor/motoboy passa a exigir usuário + senha, sem email.
-- Login continua aceitando o email de contas antigas (ex: admin) que
-- ainda não tiverem um username cadastrado.
-- ============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

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

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;

-- Opcional: defina um username para sua conta admin atual (que hoje só
-- tem email) para poder usar o novo campo "Usuário" no login também:
-- UPDATE profiles SET username = 'admin' WHERE id = '<seu-user-id>';
