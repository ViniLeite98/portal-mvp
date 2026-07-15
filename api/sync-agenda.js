// api/sync-agenda.js
// Vercel Serverless Function
// Sincroniza agendamentos do MinhaAgenda -> Supabase (banco_minha_agenda)
// Chamada pelo cron configurado em vercel.json

const TOKEN_URL        = "https://api.minhaagendaapp.com.br/oauth/token?isWeb=true";
const APPOINTMENTS_URL = "https://api.minhaagendaapp.com.br/appointments/appsByDateRange";
const BASIC_AUTH       = "bWluaGFhZ2VuZGEtc3BhOjZMR2tQdVpTcDhWS3A1dQ==";

// ---------- LOGIN ----------

async function fazerLogin() {
  const body = new URLSearchParams({
    grant_type: "password",
    username:   process.env.MA_USERNAME,
    password:   process.env.MA_PASSWORD,
  });

  const resp = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Authorization": "Basic " + BASIC_AUTH,
      "Content-Type":  "application/x-www-form-urlencoded",
      "App_is_web":    "true",
    },
    body: body.toString(),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error("Login falhou (" + resp.status + "): " + txt.slice(0, 200));
  }

  const json = await resp.json();
  return json.access_token;
}

// ---------- BUSCA ----------

async function buscarAgendamentos(token, startDate, endDate) {
  const url = APPOINTMENTS_URL + "?startDate=" + startDate + "&endDate=" + endDate;

  for (let i = 0; i < 3; i++) {
    const resp = await fetch(url, {
      headers: {
        "Authorization": "Bearer " + token,
        "Accept":        "application/json",
        "App_is_web":    "true",
      },
    });

    if (resp.status === 429) {
      console.log("Rate limit, aguardando 10s...");
      await new Promise(r => setTimeout(r, 10000));
      continue;
    }

    if (!resp.ok) throw new Error("Busca falhou: HTTP " + resp.status);

    const json = await resp.json();
    if (Array.isArray(json))       return json;
    if (json.appointments)         return json.appointments;
    return json;
  }
  return [];
}

// ---------- FORMATA DATA ----------

function hojeISO() {
  // Retorna a data de hoje no fuso GMT-3
  const now = new Date();
  const brt = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  return brt.toISOString().split("T")[0];
}

function ontemISO() {
  const now = new Date();
  const brt = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  brt.setDate(brt.getDate() - 1);
  return brt.toISOString().split("T")[0];
}

// ---------- UPSERT NO SUPABASE ----------

async function upsertSupabase(agendamentos) {
  const url     = process.env.SUPABASE_URL + "/rest/v1/banco_minha_agenda";
  const headers = {
    "Content-Type":  "application/json",
    "apikey":        process.env.SUPABASE_SERVICE_KEY,
    "Authorization": "Bearer " + process.env.SUPABASE_SERVICE_KEY,
    "Prefer":        "resolution=merge-duplicates",
  };

  // Monta os registros no formato da tabela
  const rows = agendamentos.map(a => ({
    id_agendamento: a.id,
    profissional:   a.user?.name || null,
    data:           a.date,
    hora_inicio:    a.startTime,
    hora_fim:       a.endTime,
    cliente:        a.customerName || a.customer?.name || null,
    servico:        a.serviceName  || a.service?.name  || null,
    preco:          a.price || 0,
    situacao:       "-",
    observacao:     a.comments || null,
    status:         a.deleted ? "Excluído" : (a.status || "Ativo"),
    deleted:        a.deleted || false,
    dt_exclusao:    a.deletedAt || null,
    dt_atualizacao: new Date().toISOString(),
  }));

  if (!rows.length) return { inseridos: 0 };

  // Faz upsert em lotes de 500 para não estourar o limite
  const LOTE = 500;
  let total = 0;

  for (let i = 0; i < rows.length; i += LOTE) {
    const lote = rows.slice(i, i + LOTE);
    const resp = await fetch(url, {
      method:  "POST",
      headers,
      body:    JSON.stringify(lote),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error("Supabase upsert falhou (" + resp.status + "): " + txt.slice(0, 300));
    }

    total += lote.length;
    console.log("Lote " + (i / LOTE + 1) + ": " + lote.length + " registros enviados");
  }

  return { inseridos: total };
}

// ---------- HANDLER ----------

export default async function handler(req, res) {
  // Aceita GET (cron da Vercel) ou POST (chamada manual)
  const modo = req.query.modo || "hoje"; // "hoje" ou "historico"

  try {
    console.log("[sync-agenda] Iniciando — modo: " + modo);

    if (!process.env.MA_USERNAME || !process.env.MA_PASSWORD) {
      throw new Error("MA_USERNAME / MA_PASSWORD não configurados.");
    }
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      throw new Error("SUPABASE_URL / SUPABASE_SERVICE_KEY não configurados.");
    }

    const token = await fazerLogin();
    console.log("[sync-agenda] Login OK");

    let startDate, endDate;

    if (modo === "historico") {
      // Importação completa desde 2021 — chame manualmente 1x
      startDate = req.query.inicio || "2021-09-01";
      endDate   = req.query.fim    || hojeISO();
    } else {
      // Modo padrão: ontem + hoje (garante que nada fica pra trás)
      startDate = ontemISO();
      endDate   = hojeISO();
    }

    console.log("[sync-agenda] Buscando " + startDate + " -> " + endDate);

    // Para o histórico, busca mês a mês para não timeout
    let agendamentos = [];
    if (modo === "historico") {
      const inicio = new Date(startDate + "T00:00:00");
      const fim    = new Date(endDate   + "T00:00:00");
      let cursor   = new Date(inicio.getFullYear(), inicio.getMonth(), 1);

      while (cursor <= fim) {
        const primeiroDia = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
        const ultimoDia   = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
        const blocoIni    = primeiroDia < inicio ? inicio : primeiroDia;
        const blocoFim    = ultimoDia   > fim    ? fim    : ultimoDia;

        const bStart = blocoIni.toISOString().split("T")[0];
        const bEnd   = blocoFim.toISOString().split("T")[0];

        console.log("Bloco: " + bStart + " -> " + bEnd);
        const ags = await buscarAgendamentos(token, bStart, bEnd);
        agendamentos = agendamentos.concat(ags);
        console.log("  -> " + ags.length + " registros");

        cursor.setMonth(cursor.getMonth() + 1);
        await new Promise(r => setTimeout(r, 400));
      }
    } else {
      agendamentos = await buscarAgendamentos(token, startDate, endDate);
    }

    console.log("[sync-agenda] Total buscado: " + agendamentos.length);

    const resultado = await upsertSupabase(agendamentos);
    console.log("[sync-agenda] Upsert concluído: " + resultado.inseridos + " registros");

    res.status(200).json({
      ok: true,
      modo,
      periodo: startDate + " -> " + endDate,
      agendamentos: agendamentos.length,
      upsert: resultado.inseridos,
      timestamp: new Date().toISOString(),
    });

  } catch (e) {
    console.error("[sync-agenda] ERRO:", e.message);
    res.status(500).json({ ok: false, erro: e.message });
  }
}
