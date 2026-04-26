import { supabase } from "./supabaseClients.js";

let usuarioLogado = null;

document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = '/login.html';
    return;
  }

  usuarioLogado = session.user;

  const { data: profile, error } = await supabase
    .from('usuarios')
    .select('status')
    .eq('id', usuarioLogado.id)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  if (profile.status === 'ativo') {
    window.location.href = '/dashboard.html';
    return;
  }
});

const botao = document.getElementById('assinar');

botao.addEventListener('click', async () => {
  if (!usuarioLogado) {
    window.location.href = '/login.html';
    return;
  }

  const { error: updateError } = await supabase
    .from('usuarios')
    .update({ status: 'ativo' })
    .eq('id', usuarioLogado.id);

  if (updateError) {
    console.error(updateError);
    return;
  }

  window.location.href = '/dashboard.html';
});