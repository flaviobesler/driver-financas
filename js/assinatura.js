import { supabase } from "./supabaseClients.js";
document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabase.auth.getSession();

  // Evita redirecionamento infinito se já estivermos na página de login
  if (!session && window.location.pathname !== '/login.html') {
    window.location.replace('/login.html');
    return;
  }

  if (session) {
    console.log('Usuário logado:', session.user.email);
  }
});
