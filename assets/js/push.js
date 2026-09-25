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

async function registrarPush() {
  // só roda se suportado e se tem SW registrado
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

  // aguarda usuário logado
  var u = window.usuarioLogado;
  if (!u) return;

  try {
    var reg = await navigator.serviceWorker.ready;

    // verifica se já tem subscription salva
    var subExistente = await reg.pushManager.getSubscription();
    if (subExistente) {
      // já registrado — garante que está salvo no banco
      await salvarSubscription(subExistente, u);
      return;
    }

    // pede permissão
    var perm = await Notification.requestPermission();
    if (perm !== 'granted') return;

    // cria subscription
    var sub = await reg.pushManager.subscribe({
      userVisibleOnly:      true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    await salvarSubscription(sub, u);
    console.log('Push registrado com sucesso');
  } catch(err) {
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
