import { supabase } from "./supabaseClients.js";

document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
      setTimeout(() => {
        window.location.replace('/login.html');
      }, 50); // 50ms é suficiente
      return;
    }
});

