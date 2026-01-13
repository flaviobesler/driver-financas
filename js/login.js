import { supabase } from "./supabaseClients.js";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginDrive');
  const msg = document.getElementById('msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      msg.textContent = 'email ou senha incorretos';
      return;
    }
    console.log('Sessão:', data.session);

    window.location.href = '/dashboard.html';
  });
});
