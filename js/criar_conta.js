import { supabase } from "./supabaseClients.js";
console.log('criar_conta.js carregado');


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const msg = document.getElementById('msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log(email, password);

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      console.error(error);
      msg.textContent = error.message;
      return;
    }

    msg.textContent = 'Conta criada. Verifique seu e-mail.';

  

  });
});
document.getElementById('submit').addEventListener('click', () => {
  alert('CLIQUOU');
});

