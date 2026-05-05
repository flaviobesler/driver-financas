import { supabase } from "./supabaseClients.js";

document.addEventListener('DOMContentLoaded', () => {
  const email = document.getElementById('email');
  const senha1 = document.getElementById('password');
  const senha2 = document.getElementById('password2');

  const spanEmail = document.getElementById('spanEmail');
  const msg = document.getElementById('msg');
  const msg2 = document.getElementById('msg2');

  const form = document.getElementById('signup-form');
  const btnSubmit = document.getElementById('submit');

  function validarSenha(senha) {
    const erros = [];

    if (senha.length < 8) erros.push('mínimo de 8 caracteres');
    if (!/[a-z]/.test(senha)) erros.push('uma letra minúscula');
    if (!/[A-Z]/.test(senha)) erros.push('uma letra maiúscula');
    if (!/\d/.test(senha)) erros.push('um número');
    if (!/[@$!%*#?&]/.test(senha)) erros.push('um símbolo');

    return erros;
  }

  function mostrarErrosSenha() {
    const erros = validarSenha(senha1.value);

    if (erros.length > 0) {
      msg.textContent = `A senha deve conter:\n` + erros.join(',\n');
      msg.style.color = 'red';
    } else {
      msg.textContent = '';
    }
  }

  function verificarSenhasIguais() {
    if (senha2.value === '') {
      msg2.textContent = '';
      return;
    }

    if (senha1.value !== senha2.value) {
      msg2.textContent = 'as senhas são diferentes';
      msg2.style.color = 'red';
    } else {
      msg2.textContent = '';
    }
  }

  email.addEventListener('input', () => {
    spanEmail.textContent = 'confira se o email está escrito corretamente';
    spanEmail.style.color = 'orange';
  });

  senha1.addEventListener('input', () => {
    mostrarErrosSenha();
    verificarSenhasIguais();
  });

  senha2.addEventListener('input', () => {
    verificarSenhasIguais();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const erros = validarSenha(senha1.value);

    if (erros.length > 0) {
      mostrarErrosSenha();
      return;
    }

    if (senha1.value !== senha2.value) {
      msg2.textContent = 'as senhas são diferentes';
      msg2.style.color = 'red';
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'criando conta...';

    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: senha1.value
    }, {
      emailRedirectTo: 'https://driver-financas.vercel.app/login.html'
    });

    if (error) {
      msg.textContent = error.message;
      msg.style.color = 'red';

      btnSubmit.disabled = false;
      btnSubmit.textContent = 'registrar conta';
      return;
    }

    msg.textContent = 'Conta criada. Faça o login.';
    msg.style.color = 'green';
    btnSubmit.textContent = 'conta criada';
  });
});