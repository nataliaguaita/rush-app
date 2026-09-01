export type UserRole = "admin" | "vendedor" | "entregador";
export type DeliveryStatus =
  | "aguardando_atribuicao"
  | "rota_definida"
  | "em_rota"
  | "entregue"
  | "recusada";
export type DeliveryAction = "entregar" | "receber" | "assinar_nota";
export type DeliveryPeriod = "manha" | "tarde";
export type ReceiverRole =
  | "secretaria"
  | "porteiro"
  | "morador_vizinho"
  | "proprietario";

export interface Profile {
  id: string;
  name: string;
  username: string | null;
  role: UserRole;
  phone: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Cliente {
  id: string;
  name: string;
  phone: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Endereco {
  id: string;
  cliente_id: string;
  label: string | null;
  rua: string;
  numero: string;
  complemento: string | null;
  bairro: string | null;
  cidade: string;
  cep: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
}

export interface Entrega {
  id: string;
  created_by: string;
  cliente_id: string;
  endereco_id: string;
  entregador_id: string | null;
  valor: number | null;
  status: DeliveryStatus;
  actions: DeliveryAction[];
  scheduled_period: DeliveryPeriod | null;
  scheduled_date: string | null;
  is_urgent: boolean;
  return_reminder: boolean;
  interested_name: string | null;
  interested_note: string | null;
  notes: string | null;
  route_order: number | null;
  receiver_name: string | null;
  receiver_role: ReceiverRole | null;
  receiver_note: string | null;
  delivered_at: string | null;
  refusal_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface EntregaFoto {
  id: string;
  entrega_id: string;
  storage_path: string;
  created_at: string;
}

export interface EntregaWithRelations extends Entrega {
  cliente?: Cliente;
  endereco?: Endereco;
  entregador?: Profile;
  fotos?: EntregaFoto[];
}

export interface ClienteWithEnderecos extends Cliente {
  enderecos?: Endereco[];
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;
      };
      clientes: {
        Row: Cliente;
        Insert: Omit<Cliente, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Omit<Cliente, "id" | "created_at" | "updated_at">>;
      };
      enderecos: {
        Row: Endereco;
        Insert: Omit<Endereco, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<Endereco, "id" | "created_at">>;
      };
      entregas: {
        Row: Entrega;
        Insert: Omit<Entrega, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Omit<Entrega, "id" | "created_at" | "updated_at">>;
      };
      entrega_fotos: {
        Row: EntregaFoto;
        Insert: Omit<EntregaFoto, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<EntregaFoto, "id" | "created_at">>;
      };
    };
  };
};
