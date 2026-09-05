// assets/js/push-init.js

const VAPID_KEY = "BKgZ20jVcBTAwfNC5cxizs56mz1ZS9M_eJh0NEIG69JFVN5HYvDeTuwQwIpq0HFj9z6kInUIj9SAYmud__UavwM";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD-dmeP5P9vXDE3ulNVBFZa65twbN-qWtM",
  authDomain: "hara-spa.firebaseapp.com",
  projectId: "hara-spa",
  storageBucket: "hara-spa.firebasestorage.app",
  messagingSenderId: "414347326484",
  appId: "1:414347326484:web:b7d1c3245ba7b6053aa301"
};

async function initPushNotifications(supabaseClient, funcionarioCpf) {
  try {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.warn('[Push] Navegador não suporta notificações.');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('[Push] Permissão negada.');
      return;
    }

    const swReg = await navigator.serviceWorker.ready;

    // Evita inicializar o app Firebase duas vezes
    let app;
    try {
      app = firebase.app('hara-push');
    } catch {
      app = firebase.initializeApp(FIREBASE_CONFIG, 'hara-push');
    }

    const messaging = firebase.messaging(app);

    const token = await messaging.getToken({
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swReg
    });

    if (!token) {
      console.warn('[Push] Token FCM não obtido.');
      return;
    }

    // Salva token no Supabase
    const { error } = await supabaseClient
      .from('push_subscriptions')
      .upsert(
        {
          funcionario_cpf: funcionarioCpf,
          fcm_token: token,
          user_agent: navigator.userAgent,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'funcionario_cpf,fcm_token' }
      );

    if (error) {
      console.error('[Push] Erro ao salvar token:', error);
    } else {
      console.log('[Push] Token registrado com sucesso.');
    }

    // Exibe toast quando o app está aberto (foreground)
    messaging.onMessage(payload => {
      const { title, body } = payload.notification || {};
      mostrarToastPush(title, body);
    });

  } catch (err) {
    console.error('[Push] Erro:', err);
  }
}

function mostrarToastPush(title, body) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    z-index: 9999; background: #1a1a2e; color: white;
    padding: 14px 20px; border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    max-width: 320px; width: 90%; font-family: sans-serif;
    animation: slideDown 0.3s ease;
  `;
  toast.innerHTML = `
    <style>
      @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
        to   { transform: translateX(-50%) translateY(0);     opacity: 1; }
      }
    </style>
    <div style="font-weight:600; margin-bottom:4px;">🔔 ${title || 'Hara Spa'}</div>
    <div style="font-size:13px; opacity:0.85;">${body || ''}</div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}
