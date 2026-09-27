/**
 * push.js — solicita permissão e salva subscription no Supabase
 * Incluir em todas as páginas após auth.js:
 * <script src="assets/js/push.js"></script>
 */

// ── VAPID Public Key ──────────────────────────────────────────────────────
const VAPID_PUBLIC_KEY = 'BCxJvWFWUuHrbyFt8EFQq9PlOWHbEQ00YuDheGUCXsAK261dtK0QLrxDFW8xjx_5V6XXPuQ4t1A5OaAbZEP_oP8';

function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  var raw     = window.atob(base64);
  var arr     = new Uint8Array(raw.length);
  for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

var PUSH_IOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (/macintosh/i.test(navigator.userAgent) && 'ontouchend' in document);
var PUSH_APP = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

// Aviso fixo no rodapé com botão (iPhone só deixa pedir permissão depois de um toque)
function pushAviso(html, botao, chave) {
  try { if (chave && localStorage.getItem(chave)) return; } catch (_) {}
  if (document.getElementById('pushAviso')) return;
  var d = document.createElement('div');
  d.id = 'pushAviso';
  d.style.cssText = 'position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:9999;background:#24211d;border:1px solid #c9a55c;border-radius:14px;padding:14px 14px 12px;color:#efe7da;font:14px/1.5 system-ui,-apple-system,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.45);max-width:460px;margin:0 auto';
  d.innerHTML = '<div style="display:flex;gap:10px;align-items:flex-start"><div style="font-size:20px;line-height:1">🔔</div><div style="flex:1">' + html + '</div>'
    + '<button type="button" id="pushFechar" style="background:none;border:0;color:#9d9383;font-size:20px;line-height:1;padding:0 2px;cursor:pointer">×</button></div>'
    + (botao ? '<button type="button" id="pushAtivar" style="margin-top:10px;width:100%;padding:11px;border:0;border-radius:10px;background:#c9a55c;color:#1c1a17;font-weight:700;font-size:15px;cursor:pointer">' + botao + '</button>' : '');
  document.body.appendChild(d);
  document.getElementById('pushFechar').onclick = function () {
    d.remove();
    try { if (chave) localStorage.setItem(chave, '1'); } catch (_) {}
  };
  var b = document.getElementById('pushAtivar');
  if (b) b.onclick = async function () {
    b.disabled = true; b.textContent = 'Ativando…';
    var ok = await ativarPush();
    if (ok) { d.innerHTML = '<div style="text-align:center">✅ Notificações ativadas neste aparelho.</div>'; setTimeout(function () { d.remove(); }, 2500); }
    else if (Notification.permission === 'denied') { d.remove(); avisoNegado(); }
    else { b.disabled = false; b.textContent = 'Tentar de novo'; }
  };
}

function avisoNegado() {
  pushAviso(PUSH_IOS
    ? 'As notificações estão bloqueadas. Para liberar: <b>Ajustes → Notificações → Hara Spa</b> e ative <b>Permitir Notificações</b>.'
    : 'As notificações estão bloqueadas. Toque no <b>cadeado</b> ou nos <b>⋮</b> → <b>Configurações do site</b> → <b>Notificações</b> → <b>Permitir</b>.',
    null, 'pushAvisoNegado');
}

// Chamado pelo toque no botão
async function ativarPush() {
  try {
    var perm = await Notification.requestPermission();
    if (perm !== 'granted') return false;
    var reg = await navigator.serviceWorker.ready;
    var sub = await reg.pushManager.getSubscription() || await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });
    await salvarSubscription(sub, window.usuarioLogado);
    return true;
  } catch (err) {
    console.warn('Erro ao ativar push:', err);
    return false;
  }
}

async function registrarPush() {
  var u = window.usuarioLogado;
  if (!u) return;

  // iPhone fora do app instalado: o Safari não tem notificação em aba comum
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
    if (PUSH_IOS && !PUSH_APP) {
      pushAviso('Para receber notificações no iPhone, instale o app: toque em <b>Compartilhar</b> e depois em <b>Adicionar à Tela de Início</b>. Depois abra pelo ícone <b>Hara Spa</b>.', null, 'pushAvisoIOS');
    }
    return;
  }

  try {
    var reg = await navigator.serviceWorker.ready;
    var subExistente = await reg.pushManager.getSubscription();
    if (subExistente && Notification.permission === 'granted') {
      await salvarSubscription(subExistente, u);   // garante que está salvo no banco
      return;
    }
    if (Notification.permission === 'granted') { await ativarPush(); return; }
    if (Notification.permission === 'denied') { avisoNegado(); return; }
    // 'default': ainda não perguntou → mostra o botão (precisa de toque)
    pushAviso('Ative as notificações para saber de novos agendamentos, cancelamentos e avisos.', 'Ativar notificações');
  } catch (err) {
    console.warn('Erro ao registrar push:', err);
  }
}

async function salvarSubscription(sub, u) {
  // Cada aparelho (celular, PC...) tem sua própria inscrição: registra ESTE aparelho
  // sem apagar os outros da mesma pessoa. O CPF é pego do perfil lá no banco.
  var res = await client.rpc('registrar_push', {
    p_sub: sub.toJSON(),
    p_user_agent: navigator.userAgent
  });
  if (res.error) console.error('[Push] Erro ao salvar:', res.error);
  else console.log('[Push] Aparelho registrado para notificações');
}

// roda depois que o usuário logado estiver disponível
function initPush() {
  var tentativas = 0;
  var intervalo = setInterval(function() {
    tentativas++;
    if (window.usuarioLogado) {
      clearInterval(intervalo);
      console.log('[Push] Usuário logado encontrado, iniciando push...');
      registrarPush();
    }
    if (tentativas > 60) { // 18 segundos
      clearInterval(intervalo);
      console.warn('[Push] Timeout esperando usuário logado');
    }
  }, 300);
}

document.addEventListener('DOMContentLoaded', initPush);
