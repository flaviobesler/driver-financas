import { supabase } from "./supabaseClients.js";
document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabase.auth.getSession();

  const { data: profile, error } = await supabase
    .from('usuarios')
    .select('status')
    .single();

  if (error || !profile || profile.status === 'aguardando') {
    window.location.href = '/assinar.html';
    return;
  }


});