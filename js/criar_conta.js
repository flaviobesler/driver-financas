import { supabase } from "./supabaseClients.js";



document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const msg = document.getElementById('msg');


  function validarSenha(password){
      const erros = [];

      if(password.length < 8){
        erros.push( 'minimo de 8 caracteres')};
      
      if(!/[a-z]/.test(password)){
         erros.push( 'uma letra minuscula')};
      
      if(!/[A-Z]/.test(password)){
         erros.push( 'uma letra maiúscula')};
      
      if(!/\d/.test(password)){
         erros.push( 'um número')};
      
      if(!/[@$!%*#?&]/.test(password)){
         erros.push( 'um simbulo')}; 
      return erros;
      }
  
  const inputSenha = document.getElementById('password')
  inputSenha.addEventListener('input', () =>{

    const erros = validarSenha(inputSenha.value);
    if (erros.length > 0) {
      msg.textContent = 'A senha precisa conter:\n' + erros.join(',\n ');
      msg.style.color = 'red';
      }else {
      msg.textContent = '';
      }
    

  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;

      if(password!==password2){
        msg.textContent ='as senhas não são iguais'
        msg.style.color = 'red';
      return;}

      const erros = validarSenha(password);
      if (erros.length > 0) {
        msg.textContent = 'Corrija a senha antes de continuar';
        msg.style.color = 'red';
      return;
      }
      
    


    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      msg.textContent = error.message;
      return;
    }

    msg.textContent = 'Conta criada. Verifique seu e-mail.';
    msg.style.color = 'green';

  

  });
});


