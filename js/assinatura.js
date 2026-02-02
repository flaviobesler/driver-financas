import { supabase } from "./supabaseClients.js";

document.addEventListener('DOMContentLoaded', async () => {
  const assinar = document.getElementById('assinar');
  assinar.disabled =true
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    assinar.disabled = true;
    window.location.href = '/login.html';
    return;
  }else{
    assinar.disabled =false
  }
});
