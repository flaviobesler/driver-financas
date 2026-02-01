import { supabase } from "./supabaseClients.js";
document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = '/login.html';
    return;
  }

  const { data: profile, error } = await supabase
    .from('usuarios')
    .select('status')
    .single();

  if (error || !profile || profile.status === 'cancelado' || profile.status === 'aguardando') {
    window.location.href = '/assinar.html';
    return;
  }

  // habilitar botão assinar
  document.getElementById('assinar').addEventListener('click', assinar);
});