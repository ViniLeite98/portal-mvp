// sistemahara.com/catalogo → entrega o fotos.html com o preview de partilha (WhatsApp, Instagram etc.)
// já preenchido no HTML. Esses apps não rodam JavaScript, então título/descrição/imagem
// precisam vir prontos do servidor. Os textos são editados no painel admin do catálogo.
const SUPABASE_URL = "https://rymehgsoarjeecuwyhny.supabase.co";
// chave pública (anon) — a mesma que já está em assets/js/supabase.js
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5bWVoZ3NvYXJqZWVjdXd5aG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTc0ODUsImV4cCI6MjA4NjIzMzQ4NX0.K9BUapByrh6TsSi5jEkL8HGLDmMT_tGSSykl7LGxIec";

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

module.exports = async function handler(req, res) {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "sistemahara.com";
  const origem = "https://" + host;
  try {
    const [paginaResp, cfgResp] = await Promise.all([
      fetch(origem + "/fotos.html", { headers: { "user-agent": "hara-catalogo" } }),
      fetch(SUPABASE_URL + "/rest/v1/catalogo_config?id=eq.1&select=*", {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: "Bearer " + SUPABASE_ANON_KEY },
      }),
    ]);
    let html = await paginaResp.text();
    const cfg = cfgResp.ok ? (await cfgResp.json())[0] : null;

    if (cfg) {
      const url = origem + "/catalogo";
      const img = cfg.og_imagem_path
        ? SUPABASE_URL + "/storage/v1/object/public/loja-catalogo/" + cfg.og_imagem_path.split("/").map(encodeURIComponent).join("/")
        : "";
      const og = [
        '<meta property="og:type" content="website">',
        '<meta property="og:url" content="' + esc(url) + '">',
        '<meta property="og:title" content="' + esc(cfg.og_titulo) + '">',
        '<meta property="og:description" content="' + esc(cfg.og_descricao) + '">',
        '<meta name="description" content="' + esc(cfg.og_descricao) + '">',
        img ? '<meta property="og:image" content="' + esc(img) + '">' : "",
        '<meta name="twitter:card" content="' + (img ? "summary_large_image" : "summary") + '">',
        '<meta name="twitter:title" content="' + esc(cfg.og_titulo) + '">',
        '<meta name="twitter:description" content="' + esc(cfg.og_descricao) + '">',
        img ? '<meta name="twitter:image" content="' + esc(img) + '">' : "",
      ].filter(Boolean).join("\n");
      html = html
        .replace(/<!--OG-->[\s\S]*?<!--\/OG-->/, "<!--OG-->\n" + og + "\n<!--/OG-->")
        .replace(/<title>[\s\S]*?<\/title>/, "<title>" + esc(cfg.og_titulo) + "</title>");
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    res.status(paginaResp.ok ? 200 : paginaResp.status).send(html);
  } catch (e) {
    // se algo falhar, manda a pessoa para a página normal
    res.setHeader("Location", "/fotos.html");
    res.status(302).end();
  }
};
