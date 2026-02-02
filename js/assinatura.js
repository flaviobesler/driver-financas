import { supabase } from "./supabaseClients.js";

document.addEventListener('DOMContentLoaded', async () => {
  const assinarBtn = document.getElementById('assinar');

  // Desabilita botão por padrão
  if (assinarBtn) assinarBtn.disabled = true;

  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      console.log('Usuário logado:', session.user.email);
      // Habilita o botão se o usuário estiver logado
      if (assinarBtn) assinarBtn.disabled = false;
    }

  } catch (err) {
    console.error('Erro ao verificar sessão:', err);
  }
});
