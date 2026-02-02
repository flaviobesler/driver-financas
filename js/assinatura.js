import { supabase } from "./supabaseClients.js";

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    // Se não tiver sessão, redireciona imediatamente
    if (!session) {
      setTimeout(() => {
        window.location.replace('/login.html');
      }, 50); // 50ms é suficiente
      return;
    }

    // Se tiver sessão, você pode continuar com a página normalmente
    console.log('Usuário logado:', session.user.email);

  } catch (err) {
    console.error('Erro ao verificar sessão:', err);
    // Redireciona mesmo em caso de erro
    window.location.replace('/login.html');
  }
});
