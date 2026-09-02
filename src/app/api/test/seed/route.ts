import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

const TEST_USERS = [
  { username: "admin.teste", password: "teste123", role: "admin", name: "Admin Teste" },
  { username: "vendedor.teste", password: "teste123", role: "vendedor", name: "Vendedor Teste" },
  { username: "entregador.teste", password: "teste123", role: "entregador", name: "Entregador Teste" },
  { username: "entregador.teste2", password: "teste123", role: "entregador", name: "Entregador Teste 2" },
];

const TEST_CLIENTS = [
  { name: "Dr. Carlos Silva", phone: "(41) 99999-1001" },
  { name: "Clínica Odonto Vida", phone: "(41) 99999-1002" },
  { name: "Dra. Ana Beatriz", phone: "(41) 99999-1003" },
  { name: "Lab Dental Center", phone: "(41) 99999-1004" },
  { name: "Dr. Roberto Santos", phone: "(41) 99999-1005" },
  { name: "Clínica Sorrir", phone: "(41) 99999-1006" },
];

const TEST_ADDRESSES: { clientIndex: number; label: string; rua: string; numero: string; bairro: string; cidade: string; cep: string; lat: number; lng: number }[] = [
  { clientIndex: 0, label: "Consultório", rua: "R. XV de Novembro", numero: "700", bairro: "Centro", cidade: "Curitiba", cep: "80020-310", lat: -25.4284, lng: -49.2717 },
  { clientIndex: 0, label: "Casa", rua: "R. Padre Anchieta", numero: "2050", bairro: "Bigorrilho", cidade: "Curitiba", cep: "80730-000", lat: -25.4399, lng: -49.2944 },
  { clientIndex: 1, label: "Clínica", rua: "Av. Sete de Setembro", numero: "4698", bairro: "Batel", cidade: "Curitiba", cep: "80240-000", lat: -25.4421, lng: -49.2862 },
  { clientIndex: 1, label: "Filial", rua: "R. Comendador Araújo", numero: "323", bairro: "Centro", cidade: "Curitiba", cep: "80420-000", lat: -25.4330, lng: -49.2780 },
  { clientIndex: 2, label: "Consultório", rua: "R. Visconde de Nácar", numero: "1440", bairro: "Centro", cidade: "Curitiba", cep: "80410-201", lat: -25.4395, lng: -49.2716 },
  { clientIndex: 3, label: "Laboratório", rua: "Av. Marechal Floriano Peixoto", numero: "228", bairro: "Centro", cidade: "Curitiba", cep: "80010-130", lat: -25.4260, lng: -49.2710 },
  { clientIndex: 3, label: "Depósito", rua: "R. Desembargador Westphalen", numero: "3000", bairro: "Portão", cidade: "Curitiba", cep: "80230-100", lat: -25.4550, lng: -49.2780 },
  { clientIndex: 4, label: "Consultório", rua: "R. Bruno Filgueira", numero: "369", bairro: "Batel", cidade: "Curitiba", cep: "80240-220", lat: -25.4410, lng: -49.2900 },
  { clientIndex: 5, label: "Clínica", rua: "Av. República Argentina", numero: "1228", bairro: "Água Verde", cidade: "Curitiba", cep: "80620-010", lat: -25.4510, lng: -49.2840 },
  { clientIndex: 5, label: "Filial Bacacheri", rua: "Av. Anita Garibaldi", numero: "1555", bairro: "Bacacheri", cidade: "Curitiba", cep: "82200-530", lat: -25.3950, lng: -49.2520 },
];

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Bloqueado em produção" }, { status: 403 });
  }

  const db = getAdmin();
  const log: string[] = [];
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  // --- 1. Create test users (skip if exist) ---
  const userIds: Record<string, string> = {};
  for (const u of TEST_USERS) {
    const email = `${u.username}@rushapp.local`;
    const { data: existing } = await db.from("profiles").select("id").eq("username", u.username).single();
    if (existing) {
      userIds[u.username] = existing.id;
      log.push(`Usuário ${u.username} já existe`);
      continue;
    }
    const { data, error } = await db.auth.admin.createUser({
      email, password: u.password, email_confirm: true,
      user_metadata: { name: u.name, role: u.role, username: u.username },
    });
    if (error) { log.push(`Erro criando ${u.username}: ${error.message}`); continue; }
    userIds[u.username] = data.user.id;
    await db.from("profiles").update({ username: u.username }).eq("id", data.user.id);
    log.push(`Usuário ${u.username} criado`);
  }

  const adminId = userIds["admin.teste"] || userIds["vendedor.teste"];
  const entregador1 = userIds["entregador.teste"];
  const entregador2 = userIds["entregador.teste2"];

  if (!adminId) return NextResponse.json({ error: "Sem usuário para criar entregas", log }, { status: 500 });

  // --- 2. Create test clients ---
  const clienteIds: string[] = [];
  for (const c of TEST_CLIENTS) {
    const { data, error } = await db.from("clientes").insert({ name: c.name, phone: c.phone }).select("id").single();
    if (error) { log.push(`Erro cliente ${c.name}: ${error.message}`); continue; }
    clienteIds.push(data.id);
    log.push(`Cliente ${c.name} criado`);
  }

  // --- 3. Create addresses ---
  const enderecoIds: string[] = [];
  for (const a of TEST_ADDRESSES) {
    const cid = clienteIds[a.clientIndex];
    if (!cid) continue;
    const { data, error } = await db.from("enderecos").insert({
      cliente_id: cid, label: a.label, rua: a.rua, numero: a.numero,
      bairro: a.bairro, cidade: a.cidade, cep: a.cep, lat: a.lat, lng: a.lng,
    }).select("id").single();
    if (error) { log.push(`Erro endereço ${a.rua}: ${error.message}`); continue; }
    enderecoIds.push(data.id);
  }
  log.push(`${enderecoIds.length} endereços criados`);

  // --- 4. Create entregas in various states ---
  const entregas = [
    // Aguardando atribuição (4) - para testar kanban
    { cliente: 0, endereco: 0, valor: 150, actions: ["entregar"], period: "manha", date: tomorrow, status: "aguardando_atribuicao" },
    { cliente: 1, endereco: 2, valor: 280, actions: ["entregar", "receber"], period: "manha", date: tomorrow, status: "aguardando_atribuicao", urgent: true },
    { cliente: 2, endereco: 4, valor: 95, actions: ["entregar"], period: "tarde", date: tomorrow, status: "aguardando_atribuicao" },
    { cliente: 3, endereco: 5, valor: 420, actions: ["entregar", "assinar_nota"], period: "tarde", date: tomorrow, status: "aguardando_atribuicao", notes: "Entregar no balcão do 2º andar" },

    // Rota definida para entregador 1 (3) - para testar tela do entregador
    { cliente: 4, endereco: 7, valor: 310, actions: ["entregar"], period: "manha", date: today, status: "rota_definida", entregador: entregador1, order: 1 },
    { cliente: 5, endereco: 8, valor: 175, actions: ["entregar", "receber"], period: "manha", date: today, status: "rota_definida", entregador: entregador1, order: 2 },
    { cliente: 0, endereco: 1, valor: 200, actions: ["entregar"], period: "manha", date: today, status: "rota_definida", entregador: entregador1, order: 3, return_reminder: true, interested: "Maria" },

    // Rota definida para entregador 2 (2)
    { cliente: 1, endereco: 3, valor: 550, actions: ["entregar", "assinar_nota"], period: "tarde", date: today, status: "rota_definida", entregador: entregador2, order: 1 },
    { cliente: 3, endereco: 6, valor: 130, actions: ["entregar"], period: "tarde", date: today, status: "rota_definida", entregador: entregador2, order: 2 },

    // Entregues (3) - para testar histórico e relatórios
    { cliente: 2, endereco: 4, valor: 250, actions: ["entregar"], period: "manha", date: today, status: "entregue", entregador: entregador1, receiver: { name: "Joana", role: "secretaria" } },
    { cliente: 5, endereco: 9, valor: 180, actions: ["entregar", "receber"], period: "manha", date: today, status: "entregue", entregador: entregador2, receiver: { name: "Sr. Pedro", role: "proprietario" } },
    { cliente: 4, endereco: 7, valor: 320, actions: ["entregar"], period: "tarde", date: today, status: "entregue", entregador: entregador1, receiver: { name: "Marcos", role: "porteiro" } },

    // Recusada (1) - para testar histórico
    { cliente: 0, endereco: 0, valor: 90, actions: ["entregar"], period: "tarde", date: today, status: "recusada", entregador: entregador2, refusal: "Consultório fechado, retornar amanhã" },
  ];

  let entregaCount = 0;
  for (const e of entregas) {
    const cid = clienteIds[e.cliente];
    const eid = enderecoIds[e.endereco];
    if (!cid || !eid) continue;

    const row: Record<string, unknown> = {
      created_by: adminId, cliente_id: cid, endereco_id: eid,
      valor: e.valor, actions: e.actions, status: e.status,
      scheduled_period: e.period, scheduled_date: e.date,
      is_urgent: e.urgent || false,
      return_reminder: e.return_reminder || false,
      notes: e.notes || null,
    };
    if (e.entregador) row.entregador_id = e.entregador;
    if (e.order) row.route_order = e.order;
    if (e.interested) row.interested_name = e.interested;
    if (e.receiver) {
      row.receiver_name = e.receiver.name;
      row.receiver_role = e.receiver.role;
      row.delivered_at = new Date().toISOString();
    }
    if (e.refusal) row.refusal_reason = e.refusal;

    const { error } = await db.from("entregas").insert(row);
    if (error) { log.push(`Erro entrega: ${error.message}`); continue; }
    entregaCount++;
  }
  log.push(`${entregaCount} entregas criadas`);

  return NextResponse.json({ success: true, log });
}
