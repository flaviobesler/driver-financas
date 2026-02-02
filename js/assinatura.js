import { supabase } from "./supabaseClients.js";

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    // Só redireciona se o usuário NÃO estiver logado **e não estiver na página de login**
    if (!session && !window.location.pathname.includes('login.html')) {
      window.location.replace('/login.html');
      return;
    }

    // Aqui você pode habilitar o botão ou continuar o fluxo
    const assinarBtn = document.getElementById('assinar');
    if (assinarBtn) assinarBtn.disabled = !session;

    if (session) {
      console.log('Usuário logado:', session.user.email);
    }

  } catch (err) {
    console.error('Erro ao verificar sessão:', err);

    // Redireciona com cuidado apenas se não estivermos no login
    if (!window.location.pathname.includes('login.html')) {
      window.location.replace('/login.html');
    }
  }
});
