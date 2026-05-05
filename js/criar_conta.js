import { supabase } from "./supabaseClients.js";

const email = document.getElementById('email');
const senha1 = document.getElementById('password');
const senha2 = document.getElementById('password2');

const spanemail = document.getElementById('spanEmail');
const span = document.getElementById('msg');
const span2 = document.getElementById('msg2');

const form = document.getElementById('signup-form');
const btnSubmit = document.getElementById('submit');

const verSenha1 = document.getElementById('verSenha1');
const verSenha2 = document.getElementById('verSenha2');

function alternarSenha(input, botao) {
  const visivel = input.type === 'text';

  input.type = visivel ? 'password' : 'text';
  botao.textContent = visivel ? 'ver senha' : 'ocultar senha';
}

verSenha1.addEventListener('click', () => {
  alternarSenha(senha1, verSenha1);
});

verSenha2.addEventListener('click', () => {
  alternarSenha(senha2, verSenha2);
});

email.addEventListener('input', () => {
  spanemail.textContent = 'confira se o email está escrito corretamente';
  spanemail.style.color = 'orange';
});

function validarsenha(senha) {
  const erros = [];

  if (senha.length < 8) erros.push('mínimo de 8 caracteres');
  if (!/[a-z]/.test(senha)) erros.push('uma letra minúscula');
  if (!/[A-Z]/.test(senha)) erros.push('uma letra maiúscula');
  if (!/\d/.test(senha)) erros.push('um número');
  if (!/[@$!%*#?&]/.test(senha)) erros.push('um símbolo');

  return erros;
}

senha1.addEventListener('input', () => {
  const erros = validarsenha(senha1.value);

  if (erros.length > 0) {
    span.textContent = `A senha deve conter:\n` + erros.join(',\n');
    span.style.color = 'red';
  } else {
    span.textContent = '';
  }
});

senha2.addEventListener('input', () => {
  if (senha1.value !== senha2.value) {
    span2.textContent = 'as senhas são diferentes';
    span2.style.color = 'red';
  } else {
    span2.textContent = '';
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const erros = validarsenha(senha1.value);

  if (erros.length > 0) {
    span.textContent = `A senha deve conter:\n` + erros.join(',\n');
    span.style.color = 'red';
    return;
  }

  if (senha1.value !== senha2.value) {
    span2.textContent = 'as senhas são diferentes';
    span2.style.color = 'red';
    return;
  }

  btnSubmit.disabled = true;
  btnSubmit.textContent = 'criando conta...';

  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: senha1.value
  }, {
    redirectTo: 'https://driver-financas.vercel.app/login.html'
  });

  if (error) {
    span.textContent = error.message;
    span.style.color = 'red';
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'registrar conta';
    return;
  }

  span.textContent = 'Conta criada. Faça o login.';
  span.style.color = 'green';
});